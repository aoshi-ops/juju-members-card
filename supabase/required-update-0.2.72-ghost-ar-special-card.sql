alter table public.special_cards
add column if not exists slug text,
add column if not exists front_image_url text,
add column if not exists back_image_url text,
add column if not exists external_url text,
add column if not exists external_label text,
add column if not exists unlock_condition_label text,
add column if not exists metadata jsonb not null default '{}'::jsonb,
add column if not exists sort_order integer not null default 100;

create unique index if not exists special_cards_slug_key
on public.special_cards (slug)
where slug is not null;

delete from public.special_card_entries a
using public.special_card_entries b
where a.user_id = b.user_id
  and a.special_card_id = b.special_card_id
  and a.ctid < b.ctid;

create unique index if not exists special_card_entries_user_card_key
on public.special_card_entries (user_id, special_card_id);

insert into public.special_cards (
  slug,
  title,
  description,
  card_type,
  front_image_url,
  back_image_url,
  external_url,
  external_label,
  unlock_condition_label,
  metadata,
  sort_order,
  is_active
)
values (
  'gyuhi-ghost-ar-debug',
  'おばけ',
  'デバッグ用。お化けをタップするとAR起動確認を表示する特別カードです。',
  'debug_ar',
  'assets/special-cards/gyuhi-ghost.gif',
  null,
  'https://webar.styly.cc/v2/ar_contents/joujou_ghost',
  'ARを起動',
  'デバッグ期間中、JUJU-000001のみ',
  jsonb_build_object(
    'interaction', 'ghost_ar',
    'target_member_number', 'JUJU-000001',
    'version', 1
  ),
  20,
  true
)
on conflict (slug) where slug is not null do update
set title = excluded.title,
    description = excluded.description,
    card_type = excluded.card_type,
    front_image_url = excluded.front_image_url,
    back_image_url = excluded.back_image_url,
    external_url = excluded.external_url,
    external_label = excluded.external_label,
    unlock_condition_label = excluded.unlock_condition_label,
    metadata = excluded.metadata,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active,
    updated_at = now();

with target_card as (
  select id
  from public.special_cards
  where slug = 'gyuhi-ghost-ar-debug'
  limit 1
),
target_user as (
  select id
  from public.users
  where upper(member_number) = 'JUJU-000001'
  limit 1
)
insert into public.special_card_entries (special_card_id, user_id, point_value, stamp_count, memo)
select target_card.id, target_user.id, 0, 0, 'おばけARカード デバッグ付与'
from target_card
cross join target_user
on conflict (user_id, special_card_id) do nothing;
