alter table public.user_coupons
add column if not exists expires_at timestamptz,
add column if not exists grant_key text;

create unique index if not exists user_coupons_user_grant_key
on public.user_coupons (user_id, grant_key)
where grant_key is not null;

create or replace function public.rank_number_for_points(points numeric)
returns integer
language sql
immutable
as $$
  select case
    when points >= 69 then 7
    when points >= 39 then 6
    when points >= 24 then 5
    when points >= 17 then 4
    when points >= 11 then 3
    when points >= 5.5 then 2
    else 1
  end;
$$;

create or replace function public.ensure_lifecycle_coupons()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  user_birthday date;
  today_jst date := (now() at time zone 'Asia/Tokyo')::date;
  current_year integer := extract(year from (now() at time zone 'Asia/Tokyo'))::integer;
  rank_points numeric(8,1);
  current_rank integer;
  birthday_coupon_id uuid;
  rank2_coupon_id uuid;
  rank3_coupon_id uuid;
  rank4_coupon_id uuid;
  grant_count integer := 0;
  inserted_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です。';
  end if;

  select id, birthday into current_user_id, user_birthday
  from public.users
  where auth_user_id = auth.uid();

  if current_user_id is null then
    raise exception '会員情報がありません。';
  end if;

  insert into public.coupons (title, description, expires_at, usage_limit, is_active)
  select 'birthday クーポン', 'お会計から500円引き（' || current_year || '年誕生月特典）', null, 1, true
  where not exists (
    select 1 from public.coupons
    where title = 'birthday クーポン'
      and description = 'お会計から500円引き（' || current_year || '年誕生月特典）'
  );

  insert into public.coupons (title, description, expires_at, usage_limit, is_active)
  select 'ランクアップクーポン', 'サウンドホラー300円引き（ランク2達成特典）', null, 1, true
  where not exists (
    select 1 from public.coupons
    where title = 'ランクアップクーポン'
      and description = 'サウンドホラー300円引き（ランク2達成特典）'
  );

  insert into public.coupons (title, description, expires_at, usage_limit, is_active)
  select 'ランクアップクーポン', 'サウンドホラー300円引き（ランク3達成特典）', null, 1, true
  where not exists (
    select 1 from public.coupons
    where title = 'ランクアップクーポン'
      and description = 'サウンドホラー300円引き（ランク3達成特典）'
  );

  insert into public.coupons (title, description, expires_at, usage_limit, is_active)
  select 'ランクアップクーポン', 'サウンドホラー500円引き（ランク4達成特典）', null, 1, true
  where not exists (
    select 1 from public.coupons
    where title = 'ランクアップクーポン'
      and description = 'サウンドホラー500円引き（ランク4達成特典）'
  );

  select id into birthday_coupon_id
  from public.coupons
  where title = 'birthday クーポン'
    and description = 'お会計から500円引き（' || current_year || '年誕生月特典）'
  order by created_at
  limit 1;

  select id into rank2_coupon_id
  from public.coupons
  where title = 'ランクアップクーポン'
    and description = 'サウンドホラー300円引き（ランク2達成特典）'
  order by created_at
  limit 1;

  select id into rank3_coupon_id
  from public.coupons
  where title = 'ランクアップクーポン'
    and description = 'サウンドホラー300円引き（ランク3達成特典）'
  order by created_at
  limit 1;

  select id into rank4_coupon_id
  from public.coupons
  where title = 'ランクアップクーポン'
    and description = 'サウンドホラー500円引き（ランク4達成特典）'
  order by created_at
  limit 1;

  if extract(month from user_birthday)::integer = extract(month from today_jst)::integer then
    insert into public.user_coupons (user_id, coupon_id, status, issued_at, expires_at, grant_key)
    values (current_user_id, birthday_coupon_id, 'available', now(), now() + interval '1 month', 'birthday:' || current_year)
    on conflict (user_id, grant_key) where grant_key is not null do nothing;
    get diagnostics inserted_count = row_count;
    grant_count := grant_count + inserted_count;
  end if;

  select coalesce(sum(point_value), 0) into rank_points
  from public.point_events
  where user_id = current_user_id and rank_affects = true;
  current_rank := public.rank_number_for_points(rank_points);

  if current_rank >= 2 then
    insert into public.user_coupons (user_id, coupon_id, status, issued_at, expires_at, grant_key)
    values (current_user_id, rank2_coupon_id, 'available', now(), now() + interval '3 months', 'rank:2')
    on conflict (user_id, grant_key) where grant_key is not null do nothing;
    get diagnostics inserted_count = row_count;
    grant_count := grant_count + inserted_count;
  end if;

  if current_rank >= 3 then
    insert into public.user_coupons (user_id, coupon_id, status, issued_at, expires_at, grant_key)
    values (current_user_id, rank3_coupon_id, 'available', now(), now() + interval '3 months', 'rank:3')
    on conflict (user_id, grant_key) where grant_key is not null do nothing;
    get diagnostics inserted_count = row_count;
    grant_count := grant_count + inserted_count;
  end if;

  if current_rank >= 4 then
    insert into public.user_coupons (user_id, coupon_id, status, issued_at, expires_at, grant_key)
    values (current_user_id, rank4_coupon_id, 'available', now(), now() + interval '3 months', 'rank:4')
    on conflict (user_id, grant_key) where grant_key is not null do nothing;
    get diagnostics inserted_count = row_count;
    grant_count := grant_count + inserted_count;
  end if;

  return jsonb_build_object('granted', grant_count);
end;
$$;

create or replace function public.use_user_coupon(user_coupon_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  coupon_title text;
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です。';
  end if;

  select id into current_user_id from public.users where auth_user_id = auth.uid();
  if current_user_id is null then
    raise exception '会員情報がありません。';
  end if;

  select c.title into coupon_title
  from public.user_coupons uc
  join public.coupons c on c.id = uc.coupon_id
  where uc.id = user_coupon_id
    and uc.user_id = current_user_id
    and uc.status = 'available'
    and c.is_active = true
    and (uc.expires_at is null or uc.expires_at >= now())
    and (c.expires_at is null or c.expires_at >= now());

  if coupon_title is null then
    raise exception '使用できるクーポンが見つかりません。';
  end if;

  update public.user_coupons
  set status = 'used',
      used_at = now()
  where id = user_coupon_id
    and user_id = current_user_id;

  return jsonb_build_object('used', true, 'message', coupon_title || 'を使用済みにしました。');
end;
$$;

create or replace function public.cleanup_my_coupons()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  changed_count integer;
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です。';
  end if;

  select id into current_user_id from public.users where auth_user_id = auth.uid();
  if current_user_id is null then
    raise exception '会員情報がありません。';
  end if;

  update public.user_coupons uc
  set status = 'expired'
  from public.coupons c
  where uc.coupon_id = c.id
    and uc.user_id = current_user_id
    and uc.status = 'available'
    and (
      c.is_active = false
      or (uc.expires_at is not null and uc.expires_at < now())
      or (c.expires_at is not null and c.expires_at < now())
    );

  get diagnostics changed_count = row_count;
  return jsonb_build_object('expired', changed_count);
end;
$$;

grant execute on function public.rank_number_for_points(numeric) to authenticated;
grant execute on function public.ensure_lifecycle_coupons() to authenticated;
