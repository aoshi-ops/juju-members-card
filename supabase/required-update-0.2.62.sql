create or replace function public.record_sound_horror_by_key(horror_key text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_key text := trim(coalesce(horror_key, ''));
  resolved_horror_id uuid;
  legacy_title text;
begin
  if normalized_key = '' then
    raise exception 'サウンドホラーQRが不正です。';
  end if;

  if normalized_key ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    select id into resolved_horror_id
    from public.sound_horrors
    where id = normalized_key::uuid
      and is_active = true;
  end if;

  if resolved_horror_id is null then
    legacy_title := case normalized_key
      when 'demo-1' then '腹話術人形まぁくん'
      when 'demo-2' then '岩塩仏'
      when 'demo-3' then 'お母さん役の操り人形'
      when 'demo-4' then '遺棄された黒電話'
      when 'demo-5' then '病呑守り'
      when 'demo-6' then '坑内馬の蹄鉄'
      else normalized_key
    end;

    select id into resolved_horror_id
    from public.sound_horrors
    where title = legacy_title
      and is_active = true;
  end if;

  if resolved_horror_id is null then
    raise exception 'サウンドホラー作品が見つかりません。';
  end if;

  return public.record_sound_horror(resolved_horror_id);
end;
$$;

grant execute on function public.record_sound_horror_by_key(text) to authenticated;
