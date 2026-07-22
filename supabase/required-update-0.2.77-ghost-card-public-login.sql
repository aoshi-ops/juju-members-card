create or replace function public.ensure_special_cards()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  current_member_number text;
  sound_card_id uuid;
  ghost_card_id uuid;
  completed_sound_horrors integer;
  inserted_count integer := 0;
  grant_count integer := 0;
  ghost_release_at timestamptz := timestamptz '2026-07-24 11:00:00+09';
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
    'sound-horror-5',
    '特別カード',
    'サウンドホラーを5種類体験した会員に付与される特別カードです。',
    'sound_horror_milestone',
    'assets/special-cards/sound-horror-5-front.jpg',
    'assets/special-cards/sound-horror-5-back.jpg',
    'https://x.com/kareranituite?s=11&t=EvQ0wix0a85SHwZX_CVwUQ',
    '@kareranituite',
    'サウンドホラーを5種類聞く',
    jsonb_build_object('required_distinct_sound_horrors', 5, 'version', 1),
    10,
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

  select id into sound_card_id
  from public.special_cards
  where slug = 'sound-horror-5'
  limit 1;

  select count(distinct sound_horror_id) into completed_sound_horrors
  from public.sound_horror_listens
  where user_id = current_user_id;

  if completed_sound_horrors >= 5 then
    insert into public.special_card_entries (special_card_id, user_id, point_value, stamp_count, memo)
    values (sound_card_id, current_user_id, 0, completed_sound_horrors, 'サウンドホラー5種類達成')
    on conflict (user_id, special_card_id) do nothing;
    get diagnostics inserted_count = row_count;
    grant_count := grant_count + inserted_count;
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
    'gyuhi-ghost-ar-debug',
    'おばけ',
    'お化けをタップするとAR起動確認を表示する特別カードです。',
    'debug_ar',
    'assets/special-cards/gyuhi-ghost.gif',
    null,
    'https://webar.styly.cc/v2/ar_contents/joujou_ghost',
    'ARを起動',
    '2026/7/24 11:00以降のログインで獲得',
    jsonb_build_object(
      'interaction', 'ghost_ar',
      'public_release_at', '2026-07-24T11:00:00+09:00',
      'debug_member_numbers', jsonb_build_array('JUJU-000001', 'JUJU-000002', 'JUJU-000005'),
      'version', 3
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

  select id into ghost_card_id
  from public.special_cards
  where slug = 'gyuhi-ghost-ar-debug'
  limit 1;

  if upper(coalesce(current_member_number, '')) in ('JUJU-000001', 'JUJU-000002', 'JUJU-000005')
     or now() >= ghost_release_at then
    insert into public.special_card_entries (special_card_id, user_id, point_value, stamp_count, memo)
    values (ghost_card_id, current_user_id, 0, 0, 'おばけARカード ログイン付与')
    on conflict (user_id, special_card_id) do nothing;
    get diagnostics inserted_count = row_count;
    grant_count := grant_count + inserted_count;
  end if;

  return jsonb_build_object(
    'granted', grant_count,
    'completed_sound_horrors', completed_sound_horrors,
    'ghost_release_at', ghost_release_at
  );
end;
$$;

grant execute on function public.ensure_special_cards() to authenticated;
