update public.special_cards
set title = 'おばけ',
    description = 'デバッグ用。お化けをタップするとAR起動確認を表示する特別カードです。',
    updated_at = now()
where slug = 'gyuhi-ghost-ar-debug';

update public.special_card_entries entries
set memo = 'おばけARカード デバッグ付与'
from public.special_cards cards
where entries.special_card_id = cards.id
  and cards.slug = 'gyuhi-ghost-ar-debug';
