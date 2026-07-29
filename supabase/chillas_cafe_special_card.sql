alter table public.special_card_entries
add column if not exists metadata jsonb not null default '{}'::jsonb;

insert into public.app_settings (key, value, updated_at)
values (
  'chillas_cafe_debug_staff_member_numbers',
  'JUJU-000001,JUJU-000002,JUJU-000003,JUJU-000004,JUJU-000005',
  now()
)
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

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
  'chillas-cafe-debug',
  'チラズアートコラボCafé 記念カード',
  'チラズアートコラボCaféのクローズドデバッグ用記念カードです。',
  'closed_debug_game',
  'assets/special-cards/chillas-cafe-front.jpg',
  'assets/special-cards/chillas-cafe-back.jpg',
  'https://obneao-indy.github.io/-Caf-/',
  'ゲームスタート',
  'クローズドデバッグ: JUJU-000001〜JUJU-000005',
  jsonb_build_object(
    'interaction', 'chillas_cafe_game',
    'aspect_ratio', '1200 / 628',
    'debug_staff_member_numbers', jsonb_build_array('JUJU-000001', 'JUJU-000002', 'JUJU-000003', 'JUJU-000004', 'JUJU-000005'),
    'staff_signature_storage_key', 'JUJU_CHILLAS_STAFF_SIGNATURE',
    'version', 1
  ),
  30,
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

insert into public.special_card_entries (special_card_id, user_id, point_value, stamp_count, memo)
select
  card.id,
  u.id,
  0,
  0,
  'チラズアートコラボCafé クローズドデバッグ付与'
from public.special_cards card
cross join public.users u
where card.slug = 'chillas-cafe-debug'
  and upper(u.member_number) in ('JUJU-000001', 'JUJU-000002', 'JUJU-000003', 'JUJU-000004', 'JUJU-000005')
on conflict (user_id, special_card_id) do nothing;

create or replace function public.ensure_chillas_cafe_debug_card()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  current_member_number text;
  chillas_card_id uuid;
  inserted_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です。';
  end if;

  select id, member_number into current_user_id, current_member_number
  from public.users
  where auth_user_id = auth.uid();

  if current_user_id is null then
    raise exception '会員情報がありません。';
  end if;

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
    'chillas-cafe-debug',
    'チラズアートコラボCafé 記念カード',
    'チラズアートコラボCaféのクローズドデバッグ用記念カードです。',
    'closed_debug_game',
    'assets/special-cards/chillas-cafe-front.jpg',
    'assets/special-cards/chillas-cafe-back.jpg',
    'https://obneao-indy.github.io/-Caf-/',
    'ゲームスタート',
    'クローズドデバッグ: JUJU-000001〜JUJU-000005',
    jsonb_build_object(
      'interaction', 'chillas_cafe_game',
      'aspect_ratio', '1200 / 628',
      'debug_staff_member_numbers', jsonb_build_array('JUJU-000001', 'JUJU-000002', 'JUJU-000003', 'JUJU-000004', 'JUJU-000005'),
      'staff_signature_storage_key', 'JUJU_CHILLAS_STAFF_SIGNATURE',
      'version', 1
    ),
    30,
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

  select id into chillas_card_id
  from public.special_cards
  where slug = 'chillas-cafe-debug'
  limit 1;

  if upper(coalesce(current_member_number, '')) in ('JUJU-000001', 'JUJU-000002', 'JUJU-000003', 'JUJU-000004', 'JUJU-000005') then
    insert into public.special_card_entries (special_card_id, user_id, point_value, stamp_count, memo)
    values (chillas_card_id, current_user_id, 0, 0, 'チラズアートコラボCafé クローズドデバッグ付与')
    on conflict (user_id, special_card_id) do nothing;
    get diagnostics inserted_count = row_count;
  end if;

  return jsonb_build_object('granted', inserted_count);
end;
$$;

create or replace function public.set_chillas_staff_signature(
  p_signature text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  chillas_card_id uuid;
  signature text := nullif(trim(coalesce(p_signature, '')), '');
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です。';
  end if;

  if signature is null then
    return;
  end if;

  select id into current_user_id
  from public.users
  where auth_user_id = auth.uid();

  if current_user_id is null then
    raise exception '会員情報がありません。';
  end if;

  select id into chillas_card_id
  from public.special_cards
  where slug = 'chillas-cafe-debug'
  limit 1;

  if chillas_card_id is null then
    return;
  end if;

  update public.special_card_entries
  set metadata = jsonb_set(
        coalesce(metadata, '{}'::jsonb),
        '{staff_signature}',
        to_jsonb(left(signature, 48)),
        true
      )
  where user_id = current_user_id
    and special_card_id = chillas_card_id;
end;
$$;

grant execute on function public.ensure_chillas_cafe_debug_card() to authenticated;
grant execute on function public.set_chillas_staff_signature(text) to authenticated;
