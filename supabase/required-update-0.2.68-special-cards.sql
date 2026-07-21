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

create or replace function public.ensure_special_cards()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  target_card_id uuid;
  completed_sound_horrors integer;
  grant_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'ログインが必要です。';
  end if;

  select id into current_user_id
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

  select id into target_card_id
  from public.special_cards
  where slug = 'sound-horror-5'
  limit 1;

  select count(distinct sound_horror_id) into completed_sound_horrors
  from public.sound_horror_listens
  where user_id = current_user_id;

  if completed_sound_horrors >= 5 then
    insert into public.special_card_entries (special_card_id, user_id, point_value, stamp_count, memo)
    values (target_card_id, current_user_id, 0, completed_sound_horrors, 'サウンドホラー5種類達成')
    on conflict (user_id, special_card_id) do nothing;
    get diagnostics grant_count = row_count;
  end if;

  return jsonb_build_object('granted', grant_count, 'completed_sound_horrors', completed_sound_horrors);
end;
$$;

grant execute on function public.ensure_special_cards() to authenticated;

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
