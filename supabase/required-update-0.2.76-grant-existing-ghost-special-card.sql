with target_card as (
  select id
  from public.special_cards
  where slug = 'gyuhi-ghost-ar-debug'
  limit 1
),
target_users as (
  select id
  from public.users
  where upper(member_number) in ('JUJU-000002', 'JUJU-000005')
)
insert into public.special_card_entries (special_card_id, user_id, point_value, stamp_count, memo)
select target_card.id, target_users.id, 0, 0, 'おばけARカード デバッグ追加付与'
from target_card
cross join target_users
where not exists (
  select 1
  from public.special_card_entries existing
  where existing.special_card_id = target_card.id
    and existing.user_id = target_users.id
);
