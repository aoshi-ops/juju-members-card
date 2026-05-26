-- cafeジュジュ メンバーズカード Ver.0.2
-- Supabase SQL editor で実行してください。

create extension if not exists "pgcrypto";

create sequence if not exists public.member_number_seq start 1;

create table if not exists public.app_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'staff', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.relics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  related_sound_horror_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sound_horrors (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  relic_id uuid references public.relics(id) on delete set null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'relics_related_sound_horror_fk'
      and conrelid = 'public.relics'::regclass
  ) then
    alter table public.relics
      add constraint relics_related_sound_horror_fk
      foreign key (related_sound_horror_id) references public.sound_horrors(id) on delete set null
      deferrable initially deferred;
  end if;
end;
$$;

create unique index if not exists sound_horrors_title_key on public.sound_horrors (title);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  member_number text not null unique default ('JUJU-' || lpad(nextval('public.member_number_seq')::text, 6, '0')),
  real_name text not null,
  username text not null,
  email text not null,
  birthday date not null,
  age integer not null check (age >= 0 and age <= 120),
  gender text not null check (gender in ('男性', '女性', 'その他', '回答しない')),
  birthday_visible boolean not null default true,
  icon_url text,
  favorite_relic_id uuid references public.relics(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  visit_type text not null check (visit_type in ('first_floor', 'second_floor')),
  point_value numeric(4,1) not null check (point_value in (1.0, 1.5)),
  visited_at timestamptz not null default now(),
  visit_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.sound_horror_listens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  sound_horror_id uuid not null references public.sound_horrors(id) on delete restrict,
  point_value numeric(4,1) not null default 2.0 check (point_value = 2.0),
  listened_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.point_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  point_type text not null check (point_type in ('visit_1f', 'visit_2f', 'sound_horror', 'special', 'campaign', 'manual')),
  point_value numeric(6,1) not null check (point_value % 0.5 = 0),
  rank_affects boolean not null default true,
  source_type text not null check (source_type in ('visit', 'sound_horror', 'special_experience', 'campaign', 'manual')),
  source_id uuid,
  campaign_id uuid references public.campaigns(id) on delete set null,
  memo text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.member_ranks (
  id uuid primary key default gen_random_uuid(),
  rank_number integer not null unique,
  rank_name text not null,
  min_point numeric(6,1) not null,
  max_point numeric(6,1),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  campaign_id uuid references public.campaigns(id) on delete set null,
  expires_at timestamptz,
  usage_limit integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_coupons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  status text not null default 'available' check (status in ('available', 'used', 'expired', 'disabled')),
  issued_at timestamptz not null default now(),
  used_at timestamptz
);

create unique index if not exists user_coupons_user_coupon_key
on public.user_coupons (user_id, coupon_id);

create table if not exists public.special_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  campaign_id uuid references public.campaigns(id) on delete set null,
  card_type text not null,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.special_card_entries (
  id uuid primary key default gen_random_uuid(),
  special_card_id uuid not null references public.special_cards(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  point_value numeric(6,1) default 0 check (point_value % 0.5 = 0),
  stamp_count integer default 0 check (stamp_count >= 0),
  memo text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_purchase_permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  memo text,
  is_active boolean not null default true,
  granted_by uuid default auth.uid(),
  granted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  image_url text,
  external_url text,
  source_label text,
  is_published boolean not null default true,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_reads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  news_post_id uuid not null references public.news_posts(id) on delete cascade,
  read_at timestamptz not null default now(),
  unique (user_id, news_post_id)
);

create table if not exists public.app_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

create or replace function public.create_staff_news_post(
  p_staff_id text,
  p_password text,
  p_title text,
  p_body text default null,
  p_image_url text default null,
  p_external_url text default null,
  p_source_label text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if p_staff_id <> 'joujoustaff' or p_password <> 'joujoufirstanniversary' then
    raise exception 'staff credential is invalid';
  end if;

  if coalesce(trim(p_title), '') = '' then
    raise exception 'NEWS title is required';
  end if;

  insert into public.news_posts (
    title,
    body,
    image_url,
    external_url,
    source_label,
    is_published,
    published_at
  )
  values (
    trim(p_title),
    nullif(trim(coalesce(p_body, '')), ''),
    nullif(trim(coalesce(p_image_url, '')), ''),
    nullif(trim(coalesce(p_external_url, '')), ''),
    nullif(trim(coalesce(p_source_label, '')), ''),
    true,
    now()
  )
  returning id into new_id;

  return new_id;
end;
$$;

create or replace function public.update_staff_news_post(
  p_staff_id text,
  p_password text,
  p_news_id uuid,
  p_title text,
  p_body text default null,
  p_image_url text default null,
  p_external_url text default null,
  p_source_label text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_staff_id <> 'joujoustaff' or p_password <> 'joujoufirstanniversary' then
    raise exception 'staff credential is invalid';
  end if;

  if coalesce(trim(p_title), '') = '' then
    raise exception 'NEWS title is required';
  end if;

  update public.news_posts
  set
    title = trim(p_title),
    body = nullif(trim(coalesce(p_body, '')), ''),
    image_url = nullif(trim(coalesce(p_image_url, '')), ''),
    external_url = nullif(trim(coalesce(p_external_url, '')), ''),
    source_label = nullif(trim(coalesce(p_source_label, '')), ''),
    updated_at = now()
  where id = p_news_id;
end;
$$;

create or replace function public.delete_staff_news_post(
  p_staff_id text,
  p_password text,
  p_news_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_staff_id <> 'joujoustaff' or p_password <> 'joujoufirstanniversary' then
    raise exception 'staff credential is invalid';
  end if;

  update public.news_posts
  set is_published = false, updated_at = now()
  where id = p_news_id;
end;
$$;

create or replace function public.staff_grant_coupon_to_user(
  p_staff_id text,
  p_password text,
  p_user_id uuid,
  p_coupon_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  coupon_title text;
begin
  if p_staff_id <> 'joujoustaff' or p_password <> 'joujoufirstanniversary' then
    raise exception 'staff credential is invalid';
  end if;

  select title into coupon_title
  from public.coupons
  where id = p_coupon_id
    and is_active = true
    and (expires_at is null or expires_at >= now());

  if coupon_title is null then
    raise exception '付与できるクーポンが見つかりません。';
  end if;

  if not exists (select 1 from public.users where id = p_user_id) then
    raise exception '対象ユーザーが見つかりません。';
  end if;

  insert into public.user_coupons (user_id, coupon_id, status, used_at)
  values (p_user_id, p_coupon_id, 'available', null)
  on conflict (user_id, coupon_id) do update
  set status = 'available',
      used_at = null,
      issued_at = now();

  return jsonb_build_object('granted', true, 'message', coupon_title || 'を付与しました。');
end;
$$;

create or replace function public.staff_update_app_setting(
  p_staff_id text,
  p_password text,
  p_key text,
  p_value text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_staff_id <> 'joujoustaff' or p_password <> 'joujoufirstanniversary' then
    raise exception 'staff credential is invalid';
  end if;

  insert into public.app_settings (key, value, updated_at)
  values (p_key, p_value, now())
  on conflict (key) do update
  set value = excluded.value,
      updated_at = now();
end;
$$;

grant usage on schema public to anon, authenticated;
grant usage on sequence public.member_number_seq to authenticated;
grant select, insert, update, delete on
  public.app_profiles,
  public.users,
  public.visits,
  public.sound_horror_listens,
  public.point_events,
  public.member_ranks,
  public.coupons,
  public.user_coupons,
  public.campaigns,
  public.relics,
  public.sound_horrors,
  public.special_cards,
  public.special_card_entries,
  public.user_purchase_permissions,
  public.news_posts,
  public.news_reads,
  public.app_settings
to authenticated;

grant select, insert on public.news_posts to anon;
grant select on public.app_settings to anon, authenticated;
grant execute on function public.create_staff_news_post(text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.update_staff_news_post(text, text, uuid, text, text, text, text, text) to anon, authenticated;
grant execute on function public.delete_staff_news_post(text, text, uuid) to anon, authenticated;
grant execute on function public.staff_grant_coupon_to_user(text, text, uuid, uuid) to anon, authenticated;
grant execute on function public.staff_update_app_setting(text, text, text, text) to anon, authenticated;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.app_profiles
    where auth_user_id = auth.uid()
      and role in ('staff', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.app_profiles
    where auth_user_id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.current_app_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.app_profiles (auth_user_id, role)
  values (new.id, 'user')
  on conflict (auth_user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.record_visit(visit_kind text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  today_count integer;
  points numeric(4,1);
  new_visit_id uuid;
  rank_points numeric(8,1);
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です。';
  end if;

  if visit_kind not in ('first_floor', 'second_floor') then
    raise exception '不正な来店種別です。';
  end if;

  select id into current_user_id from public.users where auth_user_id = auth.uid();
  if current_user_id is null then
    raise exception '会員情報がありません。';
  end if;

  select count(*) into today_count
  from public.visits
  where user_id = current_user_id and visit_date = current_date;

  if exists (
    select 1
    from public.visits
    where user_id = current_user_id
      and visit_type = visit_kind
      and visited_at > now() - interval '5 seconds'
  ) then
    return jsonb_build_object(
      'recorded', false,
      'message', '直前に同じ来店QRを記録済みです。少し待ってから再度読み取ってください。'
    );
  end if;

  if today_count >= 2 then
    return jsonb_build_object(
      'recorded', false,
      'message', '本日の来店記録は上限に達しています。本日の来店：2 / 2回'
    );
  end if;

  points := case when visit_kind = 'second_floor' then 1.5 else 1.0 end;

  insert into public.visits (user_id, visit_type, point_value)
  values (current_user_id, visit_kind, points)
  returning id into new_visit_id;

  insert into public.point_events (user_id, point_type, point_value, rank_affects, source_type, source_id, created_by)
  values (
    current_user_id,
    case when visit_kind = 'second_floor' then 'visit_2f' else 'visit_1f' end,
    points,
    true,
    'visit',
    new_visit_id,
    auth.uid()
  );

  select coalesce(sum(point_value), 0) into rank_points
  from public.point_events
  where user_id = current_user_id and rank_affects = true;

  return jsonb_build_object(
    'recorded', true,
    'message', '来店を記録しました。本日の来店：' || (today_count + 1) || ' / 2回 今回の獲得ポイント：' || points || 'pt 現在のランクポイント：' || rank_points || 'pt'
  );
end;
$$;

create or replace function public.record_sound_horror(horror_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  listen_id uuid;
  horror_title text;
  listen_count integer;
  completed_count integer;
  total_count integer;
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です。';
  end if;

  select id into current_user_id from public.users where auth_user_id = auth.uid();
  if current_user_id is null then
    raise exception '会員情報がありません。';
  end if;

  select title into horror_title from public.sound_horrors where id = horror_id and is_active = true;
  if horror_title is null then
    raise exception 'サウンドホラー作品が見つかりません。';
  end if;

  if exists (
    select 1
    from public.sound_horror_listens
    where user_id = current_user_id
      and sound_horror_id = horror_id
      and listened_at > now() - interval '5 seconds'
  ) then
    return jsonb_build_object(
      'recorded', false,
      'message', '直前に同じサウンドホラーQRを記録済みです。少し待ってから再度読み取ってください。'
    );
  end if;

  insert into public.sound_horror_listens (user_id, sound_horror_id, point_value)
  values (current_user_id, horror_id, 2.0)
  returning id into listen_id;

  insert into public.point_events (user_id, point_type, point_value, rank_affects, source_type, source_id, created_by)
  values (current_user_id, 'sound_horror', 2.0, true, 'sound_horror', listen_id, auth.uid());

  select count(*) into listen_count
  from public.sound_horror_listens
  where user_id = current_user_id and sound_horror_id = horror_id;

  select count(distinct sound_horror_id) into completed_count
  from public.sound_horror_listens
  where user_id = current_user_id;

  select count(*) into total_count
  from public.sound_horrors
  where is_active = true;

  return jsonb_build_object(
    'recorded', true,
    'message', '『' || horror_title || '』を体験記録しました。今回の獲得ポイント：2pt この作品の体験回数：' || listen_count || '回 サウンドホラー制覇率：' || completed_count || ' / ' || total_count
  );
end;
$$;

create or replace function public.record_special_experience(experience_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  experience_title text;
  points numeric(6,1);
  rank_points numeric(8,1);
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です。';
  end if;

  select id into current_user_id from public.users where auth_user_id = auth.uid();
  if current_user_id is null then
    raise exception '会員情報がありません。';
  end if;

  if experience_code = 'sange-box' then
    experience_title := 'さんげの箱';
    points := 3.0;
  else
    raise exception '体験サービスが見つかりません。';
  end if;

  if exists (
    select 1
    from public.point_events
    where user_id = current_user_id
      and point_type = 'special'
      and source_type = 'special_experience'
      and memo = experience_title
      and created_at > now() - interval '5 seconds'
  ) then
    return jsonb_build_object(
      'recorded', false,
      'message', '直前に同じ体験QRを記録済みです。少し待ってから再度読み取ってください。'
    );
  end if;

  insert into public.point_events (user_id, point_type, point_value, rank_affects, source_type, memo, created_by)
  values (current_user_id, 'special', points, true, 'special_experience', experience_title, auth.uid());

  select coalesce(sum(point_value), 0) into rank_points
  from public.point_events
  where user_id = current_user_id and rank_affects = true;

  return jsonb_build_object(
    'recorded', true,
    'message', experience_title || 'を記録しました。今回の獲得ポイント：' || points || 'pt 現在のランクポイント：' || rank_points || 'pt'
  );
end;
$$;

create or replace function public.ensure_registration_coupon()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  target_coupon_id uuid;
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です。';
  end if;

  select id into current_user_id from public.users where auth_user_id = auth.uid();
  if current_user_id is null then
    raise exception '会員情報がありません。';
  end if;

  insert into public.coupons (title, description, expires_at, usage_limit, is_active)
  select '会員登録キャンペーンクーポン', 'サウンドホラー一回無料（￥1,000作品のみ対象）', null, 1, true
  where not exists (
    select 1 from public.coupons where title = '会員登録キャンペーンクーポン'
  );

  select id into target_coupon_id
  from public.coupons
  where title = '会員登録キャンペーンクーポン'
  order by created_at
  limit 1;

  insert into public.user_coupons (user_id, coupon_id, status)
  values (current_user_id, target_coupon_id, 'available')
  on conflict (user_id, coupon_id) do nothing;

  return jsonb_build_object('granted', true, 'coupon_id', target_coupon_id);
end;
$$;

create or replace function public.claim_coupon(target_coupon_id uuid)
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

  select title into coupon_title
  from public.coupons
  where id = target_coupon_id
    and is_active = true
    and (expires_at is null or expires_at >= now());

  if coupon_title is null then
    raise exception '取得できるクーポンが見つかりません。';
  end if;

  insert into public.user_coupons (user_id, coupon_id, status)
  values (current_user_id, target_coupon_id, 'available')
  on conflict (user_id, coupon_id) do nothing;

  return jsonb_build_object('claimed', true, 'message', coupon_title || 'を取得しました。');
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

create or replace function public.grant_coupon_to_user(target_user_id uuid, target_coupon_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  coupon_title text;
begin
  if not public.is_staff() then
    raise exception 'スタッフ権限が必要です。';
  end if;

  select title into coupon_title
  from public.coupons
  where id = target_coupon_id
    and is_active = true
    and (expires_at is null or expires_at >= now());

  if coupon_title is null then
    raise exception '付与できるクーポンが見つかりません。';
  end if;

  if not exists (select 1 from public.users where id = target_user_id) then
    raise exception '対象ユーザーが見つかりません。';
  end if;

  insert into public.user_coupons (user_id, coupon_id, status, used_at)
  values (target_user_id, target_coupon_id, 'available', null)
  on conflict (user_id, coupon_id) do update
  set status = 'available',
      used_at = null,
      issued_at = now();

  return jsonb_build_object('granted', true, 'message', coupon_title || 'を付与しました。');
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
  deleted_count integer;
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です。';
  end if;

  select id into current_user_id from public.users where auth_user_id = auth.uid();
  if current_user_id is null then
    raise exception '会員情報がありません。';
  end if;

  delete from public.user_coupons uc
  using public.coupons c
  where uc.coupon_id = c.id
    and uc.user_id = current_user_id
    and (
      uc.status in ('used', 'expired', 'disabled')
      or c.is_active = false
      or (c.expires_at is not null and c.expires_at < now())
    );

  get diagnostics deleted_count = row_count;
  return jsonb_build_object('deleted', deleted_count);
end;
$$;

create or replace view public.admin_user_summaries
with (security_invoker = true)
as
select
  u.*,
  coalesce((
    select sum(pe.point_value)
    from public.point_events pe
    where pe.user_id = u.id
      and pe.rank_affects = true
  ), 0)::numeric(8,1) as rank_points,
  (
    select count(*)
    from public.visits v
    where v.user_id = u.id
  ) as total_visit_count,
  (
    select count(*)
    from public.sound_horror_listens shl
    where shl.user_id = u.id
  ) as sound_horror_listen_count,
  (
    select max(v.visited_at)
    from public.visits v
    where v.user_id = u.id
  ) as last_visited_at
from public.users u;

grant select on public.admin_user_summaries to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.current_app_user_id() to authenticated;
grant execute on function public.record_visit(text) to authenticated;
grant execute on function public.record_sound_horror(uuid) to authenticated;
grant execute on function public.record_special_experience(text) to authenticated;
grant execute on function public.ensure_registration_coupon() to authenticated;
grant execute on function public.claim_coupon(uuid) to authenticated;
grant execute on function public.use_user_coupon(uuid) to authenticated;
grant execute on function public.grant_coupon_to_user(uuid, uuid) to authenticated;
grant execute on function public.cleanup_my_coupons() to authenticated;

alter table public.app_profiles enable row level security;
alter table public.users enable row level security;
alter table public.visits enable row level security;
alter table public.sound_horror_listens enable row level security;
alter table public.point_events enable row level security;
alter table public.member_ranks enable row level security;
alter table public.coupons enable row level security;
alter table public.user_coupons enable row level security;
alter table public.campaigns enable row level security;
alter table public.relics enable row level security;
alter table public.sound_horrors enable row level security;
alter table public.special_cards enable row level security;
alter table public.special_card_entries enable row level security;
alter table public.user_purchase_permissions enable row level security;
alter table public.news_posts enable row level security;
alter table public.news_reads enable row level security;
alter table public.app_settings enable row level security;

drop policy if exists "profiles_select_own_or_staff" on public.app_profiles;
create policy "profiles_select_own_or_staff" on public.app_profiles
for select using (auth_user_id = auth.uid() or public.is_staff());

drop policy if exists "profiles_admin_update" on public.app_profiles;
create policy "profiles_admin_update" on public.app_profiles
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "users_select_own_or_staff" on public.users;
create policy "users_select_own_or_staff" on public.users
for select using (auth_user_id = auth.uid() or public.is_staff());

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
for insert with check (auth_user_id = auth.uid());

drop policy if exists "users_update_own_or_staff" on public.users;
create policy "users_update_own_or_staff" on public.users
for update using (auth_user_id = auth.uid() or public.is_staff())
with check (auth_user_id = auth.uid() or public.is_staff());

drop policy if exists "visits_select_own_or_staff" on public.visits;
create policy "visits_select_own_or_staff" on public.visits
for select using (user_id = public.current_app_user_id() or public.is_staff());

drop policy if exists "visits_staff_insert" on public.visits;
create policy "visits_staff_insert" on public.visits
for insert with check (public.is_staff());

drop policy if exists "sound_listens_select_own_or_staff" on public.sound_horror_listens;
create policy "sound_listens_select_own_or_staff" on public.sound_horror_listens
for select using (user_id = public.current_app_user_id() or public.is_staff());

drop policy if exists "sound_listens_staff_insert" on public.sound_horror_listens;
create policy "sound_listens_staff_insert" on public.sound_horror_listens
for insert with check (public.is_staff());

drop policy if exists "point_events_select_own_or_staff" on public.point_events;
create policy "point_events_select_own_or_staff" on public.point_events
for select using (user_id = public.current_app_user_id() or public.is_staff());

drop policy if exists "point_events_staff_insert" on public.point_events;
create policy "point_events_staff_insert" on public.point_events
for insert with check (public.is_staff());

drop policy if exists "point_events_staff_update" on public.point_events;
create policy "point_events_staff_update" on public.point_events
for update using (public.is_staff()) with check (public.is_staff());

drop policy if exists "user_coupons_select_own_or_staff" on public.user_coupons;
create policy "user_coupons_select_own_or_staff" on public.user_coupons
for select using (user_id = public.current_app_user_id() or public.is_staff());

drop policy if exists "user_coupons_staff_write" on public.user_coupons;
create policy "user_coupons_staff_write" on public.user_coupons
for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "public_active_ranks" on public.member_ranks;
create policy "public_active_ranks" on public.member_ranks
for select using (auth.uid() is not null);

drop policy if exists "admin_manage_ranks" on public.member_ranks;
create policy "admin_manage_ranks" on public.member_ranks
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "coupons_public_active_or_staff" on public.coupons;
create policy "coupons_public_active_or_staff" on public.coupons
for select using ((is_active = true and auth.uid() is not null) or public.is_staff());

drop policy if exists "coupons_staff_write" on public.coupons;
create policy "coupons_staff_write" on public.coupons
for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "campaigns_public_active_or_staff" on public.campaigns;
create policy "campaigns_public_active_or_staff" on public.campaigns
for select using ((is_active = true and auth.uid() is not null) or public.is_staff());

drop policy if exists "campaigns_staff_write" on public.campaigns;
create policy "campaigns_staff_write" on public.campaigns
for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "relics_public_active_or_staff" on public.relics;
create policy "relics_public_active_or_staff" on public.relics
for select using ((is_active = true and auth.uid() is not null) or public.is_staff());

drop policy if exists "relics_staff_write" on public.relics;
create policy "relics_staff_write" on public.relics
for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "sound_horrors_public_active_or_staff" on public.sound_horrors;
create policy "sound_horrors_public_active_or_staff" on public.sound_horrors
for select using ((is_active = true and auth.uid() is not null) or public.is_staff());

drop policy if exists "sound_horrors_staff_write" on public.sound_horrors;
create policy "sound_horrors_staff_write" on public.sound_horrors
for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "special_cards_public_active_or_staff" on public.special_cards;
create policy "special_cards_public_active_or_staff" on public.special_cards
for select using ((is_active = true and auth.uid() is not null) or public.is_staff());

drop policy if exists "special_cards_staff_write" on public.special_cards;
create policy "special_cards_staff_write" on public.special_cards
for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "special_entries_select_own_or_staff" on public.special_card_entries;
create policy "special_entries_select_own_or_staff" on public.special_card_entries
for select using (user_id = public.current_app_user_id() or public.is_staff());

drop policy if exists "special_entries_staff_write" on public.special_card_entries;
create policy "special_entries_staff_write" on public.special_card_entries
for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "purchase_permissions_select_own_or_staff" on public.user_purchase_permissions;
create policy "purchase_permissions_select_own_or_staff" on public.user_purchase_permissions
for select using (user_id = public.current_app_user_id() or public.is_staff());

drop policy if exists "purchase_permissions_staff_write" on public.user_purchase_permissions;
create policy "purchase_permissions_staff_write" on public.user_purchase_permissions
for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "news_posts_public_published_or_staff" on public.news_posts;
create policy "news_posts_public_published_or_staff" on public.news_posts
for select using (is_published = true or public.is_staff());

drop policy if exists "news_posts_staff_write" on public.news_posts;
create policy "news_posts_staff_write" on public.news_posts
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "news_posts_demo_insert" on public.news_posts;
create policy "news_posts_demo_insert" on public.news_posts
  for insert to anon
  with check (is_published = true);

drop policy if exists "news_reads_select_own_or_staff" on public.news_reads;
create policy "news_reads_select_own_or_staff" on public.news_reads
for select using (user_id = public.current_app_user_id() or public.is_staff());

drop policy if exists "news_reads_insert_own" on public.news_reads;
create policy "news_reads_insert_own" on public.news_reads
for insert with check (user_id = public.current_app_user_id());

drop policy if exists "news_reads_update_own" on public.news_reads;
create policy "news_reads_update_own" on public.news_reads
for update using (user_id = public.current_app_user_id()) with check (user_id = public.current_app_user_id());

drop policy if exists "app_settings_public_read" on public.app_settings;
create policy "app_settings_public_read" on public.app_settings
for select using (true);

drop policy if exists "app_settings_staff_write" on public.app_settings;
create policy "app_settings_staff_write" on public.app_settings
for all using (public.is_staff()) with check (public.is_staff());

insert into public.member_ranks (rank_number, rank_name, min_point, max_point)
values
  (1, '迷い人', 1, 5),
  (2, '常連の気配', 5.5, 10.5),
  (3, '好事家', 11, 16.5),
  (4, '呪物愛好家', 17, 23.5),
  (5, '呪物収集家', 24, 38.5),
  (6, '呪物倉庫付き学芸員', 39, 68.5),
  (7, '呪物博士', 69, null)
on conflict (rank_number) do update
set rank_name = excluded.rank_name,
    min_point = excluded.min_point,
    max_point = excluded.max_point,
    updated_at = now();

with relic_seed(name, description) as (
  values
  ('病呑守り', '推し呪物候補'),
  ('さんげの箱', '推し呪物候補'),
  ('岩塩仏', '推し呪物候補'),
  ('遺棄された黒電話', '推し呪物候補'),
  ('お母さん役の操り人形', '推し呪物候補'),
  ('坑内馬の蹄鉄', '推し呪物候補'),
  ('腹話術人形まぁくん', '推し呪物候補')
)
insert into public.relics (name, description, is_active)
select seed.name, seed.description, true
from relic_seed seed
where not exists (
  select 1 from public.relics existing where existing.name = seed.name
);

with horror_seed(title, description) as (
  values
  ('腹話術人形まぁくん', 'サウンドホラー初期作品'),
  ('岩塩仏', 'サウンドホラー初期作品'),
  ('お母さん役の操り人形', 'サウンドホラー初期作品'),
  ('遺棄された黒電話', 'サウンドホラー初期作品'),
  ('病呑守り', 'サウンドホラー初期作品'),
  ('坑内馬の蹄鉄', 'サウンドホラー初期作品')
)
update public.sound_horrors target
set description = seed.description,
    is_active = true,
    updated_at = now()
from horror_seed seed
where target.title = seed.title;

with horror_seed(title, description) as (
  values
  ('腹話術人形まぁくん', 'サウンドホラー初期作品'),
  ('岩塩仏', 'サウンドホラー初期作品'),
  ('お母さん役の操り人形', 'サウンドホラー初期作品'),
  ('遺棄された黒電話', 'サウンドホラー初期作品'),
  ('病呑守り', 'サウンドホラー初期作品'),
  ('坑内馬の蹄鉄', 'サウンドホラー初期作品')
)
insert into public.sound_horrors (title, description, is_active)
select seed.title, seed.description, true
from horror_seed seed
where not exists (
  select 1 from public.sound_horrors existing where existing.title = seed.title
);

update public.sound_horrors
set is_active = false,
    updated_at = now()
where title not in (
  '腹話術人形まぁくん',
  '岩塩仏',
  'お母さん役の操り人形',
  '遺棄された黒電話',
  '病呑守り',
  '坑内馬の蹄鉄'
);

insert into public.coupons (title, description, expires_at, usage_limit, is_active)
select '会員登録キャンペーンクーポン', 'サウンドホラー一回無料（￥1,000作品のみ対象）', null, 1, true
where not exists (
  select 1 from public.coupons where title = '会員登録キャンペーンクーポン'
);

insert into public.user_coupons (user_id, coupon_id, status)
select u.id, c.id, 'available'
from public.users u
cross join lateral (
  select id from public.coupons
  where title = '会員登録キャンペーンクーポン'
  order by created_at
  limit 1
) c
on conflict (user_id, coupon_id) do nothing;
