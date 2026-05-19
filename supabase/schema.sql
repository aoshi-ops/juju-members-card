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

grant usage on schema public to authenticated;
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
  public.special_card_entries
to authenticated;

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

create or replace view public.admin_user_summaries
with (security_invoker = true)
as
select
  u.*,
  coalesce(sum(pe.point_value) filter (where pe.rank_affects = true), 0)::numeric(8,1) as rank_points,
  count(distinct v.id) as total_visit_count,
  count(distinct shl.id) as sound_horror_listen_count,
  max(v.visited_at) as last_visited_at
from public.users u
left join public.point_events pe on pe.user_id = u.id
left join public.visits v on v.user_id = u.id
left join public.sound_horror_listens shl on shl.user_id = u.id
group by u.id;

grant select on public.admin_user_summaries to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.current_app_user_id() to authenticated;
grant execute on function public.record_visit(text) to authenticated;
grant execute on function public.record_sound_horror(uuid) to authenticated;

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

insert into public.member_ranks (rank_number, rank_name, min_point, max_point)
values
  (1, '迷い人', 1, 5),
  (2, '常連の気配', 5.5, 10.5),
  (3, '蒐集者見習い', 11, 16.5),
  (4, '呪物蒐集者', 17, 23.5),
  (5, '呪物管理者', 24, 38.5),
  (6, '説明会補佐', 39, 68.5),
  (7, '蒐集録管理人', 69, null)
on conflict (rank_number) do update
set rank_name = excluded.rank_name,
    min_point = excluded.min_point,
    max_point = excluded.max_point;

insert into public.sound_horrors (title, description, is_active)
values
  ('坑内馬の蹄鉄', 'サウンドホラー初期作品', true),
  ('病呑守り', 'サウンドホラー初期作品', true),
  ('遺棄された黒電話', 'サウンドホラー初期作品', true),
  ('クラウドサービス', 'サウンドホラー初期作品', true),
  ('合わせ鏡の子守唄', 'サウンドホラー初期作品', true),
  ('深夜二階席', 'サウンドホラー初期作品', true),
  ('煤けた人形', 'サウンドホラー初期作品', true),
  ('閉店後の足音', 'サウンドホラー初期作品', true),
  ('鈴のない御守り', 'サウンドホラー初期作品', true),
  ('雨の日の客', 'サウンドホラー初期作品', true),
  ('借りた名前', 'サウンドホラー初期作品', true),
  ('返事をする棚', 'サウンドホラー初期作品', true)
on conflict do nothing;
