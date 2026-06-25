create table if not exists public.feedback_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  message text not null check (char_length(trim(message)) between 1 and 1200),
  created_at timestamptz not null default now()
);

create index if not exists feedback_messages_user_created_idx
on public.feedback_messages (user_id, created_at desc);

grant select, insert on public.feedback_messages to authenticated;

alter table public.feedback_messages enable row level security;

drop policy if exists "feedback_messages_select_own_or_staff" on public.feedback_messages;
create policy "feedback_messages_select_own_or_staff" on public.feedback_messages
for select using (user_id = public.current_app_user_id() or public.is_staff());

drop policy if exists "feedback_messages_insert_own" on public.feedback_messages;
create policy "feedback_messages_insert_own" on public.feedback_messages
for insert with check (user_id = public.current_app_user_id());

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

  if today_count >= 1 then
    return jsonb_build_object(
      'recorded', false,
      'message', '本日の来店記録は上限に達しています。本日の来店：1 / 1回'
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
    'message', '来店を記録しました。本日の来店：' || (today_count + 1) || ' / 1回 今回の獲得ポイント：' || points || 'pt 現在のランクポイント：' || rank_points || 'pt'
  );
end;
$$;

grant execute on function public.record_visit(text) to authenticated;
