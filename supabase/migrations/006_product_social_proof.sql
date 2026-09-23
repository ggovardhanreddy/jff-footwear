-- Ratings and wishlist counts are calculated from stored rows.
-- Nothing in this migration inserts sample ratings or reviews.

alter table public.reviews
  add column if not exists verified_purchase boolean not null default false,
  add column if not exists helpful_count integer not null default 0,
  add column if not exists image_url text;

create index if not exists reviews_product_approved_idx
  on public.reviews (product_slug)
  where approved = true;

create index if not exists wishlists_product_slug_idx
  on public.wishlists (product_slug);

create table if not exists public.review_helpful (
  review_id uuid not null references public.reviews (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);

alter table public.review_helpful enable row level security;

drop policy if exists "review_helpful_insert_own" on public.review_helpful;
create policy "review_helpful_insert_own"
  on public.review_helpful for insert
  with check (auth.uid() = user_id);

drop policy if exists "review_helpful_read_own" on public.review_helpful;
create policy "review_helpful_read_own"
  on public.review_helpful for select
  using (auth.uid() = user_id or public.is_admin());

create or replace function public.protect_review_flags()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.approved := false;
    new.helpful_count := 0;
    new.image_url := null;
    new.verified_purchase := exists (
      select 1
      from public.order_items oi
      join public.orders o on o.id = oi.order_id
      where o.user_id = auth.uid()
        and oi.product_slug = new.product_slug
        and o.status = 'delivered'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists reviews_protect_flags on public.reviews;
create trigger reviews_protect_flags
  before insert on public.reviews
  for each row
  execute function public.protect_review_flags();

create or replace function public.list_product_social_proof()
returns table (
  product_slug text,
  rating_average double precision,
  rating_count integer,
  review_count integer,
  wishlist_count integer,
  review_distribution jsonb,
  verified_review_count integer,
  helpful_review_count integer
)
language sql
stable
security definer
set search_path = public
as $$
  with slugs as (
    select r.product_slug
    from public.reviews r
    where r.approved = true
    union
    select w.product_slug
    from public.wishlists w
  )
  select
    s.product_slug,
    case
      when count(r.id) = 0 then null
      else round(avg(r.rating)::numeric, 1)::double precision
    end as rating_average,
    count(r.id)::integer as rating_count,
    count(r.id) filter (where coalesce(btrim(r.body), '') <> '')::integer as review_count,
    (
      select count(*)::integer
      from public.wishlists w
      where w.product_slug = s.product_slug
    ) as wishlist_count,
    jsonb_build_object(
      '1', count(r.id) filter (where r.rating = 1),
      '2', count(r.id) filter (where r.rating = 2),
      '3', count(r.id) filter (where r.rating = 3),
      '4', count(r.id) filter (where r.rating = 4),
      '5', count(r.id) filter (where r.rating = 5)
    ) as review_distribution,
    count(r.id) filter (where r.verified_purchase)::integer as verified_review_count,
    coalesce(sum(r.helpful_count), 0)::integer as helpful_review_count
  from slugs s
  left join public.reviews r
    on r.product_slug = s.product_slug
   and r.approved = true
  group by s.product_slug;
$$;

create or replace function public.list_product_reviews(slug text)
returns table (
  id uuid,
  product_slug text,
  author_name text,
  rating integer,
  title text,
  body text,
  created_at timestamptz,
  verified_purchase boolean,
  helpful_count integer,
  image_url text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    r.id,
    r.product_slug,
    coalesce(nullif(btrim(p.full_name), ''), 'JFF customer') as author_name,
    r.rating,
    r.title,
    r.body,
    r.created_at,
    r.verified_purchase,
    r.helpful_count,
    r.image_url
  from public.reviews r
  left join public.profiles p on p.id = r.user_id
  where r.product_slug = slug
    and r.approved = true
    and coalesce(btrim(r.body), '') <> ''
  order by r.created_at desc;
$$;

create or replace function public.mark_review_helpful(review uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  total integer;
begin
  if auth.uid() is null then
    raise exception 'Sign in required';
  end if;

  if not exists (
    select 1 from public.reviews r
    where r.id = review and r.approved = true
  ) then
    raise exception 'Review not found';
  end if;

  insert into public.review_helpful (review_id, user_id)
  values (review, auth.uid())
  on conflict do nothing;

  select count(*)::integer into total
  from public.review_helpful
  where review_id = review;

  update public.reviews
  set helpful_count = total
  where id = review;

  return total;
end;
$$;

revoke all on function public.list_product_social_proof() from public;
revoke all on function public.list_product_reviews(text) from public;
revoke all on function public.mark_review_helpful(uuid) from public;

grant execute on function public.list_product_social_proof() to anon, authenticated;
grant execute on function public.list_product_reviews(text) to anon, authenticated;
grant execute on function public.mark_review_helpful(uuid) to authenticated;
