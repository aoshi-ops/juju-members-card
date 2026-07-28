create index if not exists news_posts_public_schedule_idx
on public.news_posts (is_published, published_at desc);

create or replace function public.create_staff_news_post(
  p_staff_id text,
  p_password text,
  p_title text,
  p_body text default null,
  p_image_url text default null,
  p_external_url text default null,
  p_source_label text default null,
  p_published_at timestamptz default null
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
    coalesce(p_published_at, now())
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
  p_source_label text default null,
  p_published_at timestamptz default null
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
    published_at = coalesce(p_published_at, published_at),
    updated_at = now()
  where id = p_news_id;
end;
$$;

grant execute on function public.create_staff_news_post(text, text, text, text, text, text, text, timestamptz) to anon, authenticated;
grant execute on function public.update_staff_news_post(text, text, uuid, text, text, text, text, text, timestamptz) to anon, authenticated;

drop policy if exists "news_posts_public_published_or_staff" on public.news_posts;
create policy "news_posts_public_published_or_staff" on public.news_posts
for select using ((is_published = true and published_at <= now()) or public.is_staff());
