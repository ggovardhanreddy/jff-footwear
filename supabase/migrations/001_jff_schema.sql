-- JFF Footwear — Supabase free-tier schema
-- Run in Supabase SQL Editor (Dashboard → SQL)

create extension if not exists "pgcrypto";

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  email text,
  avatar_url text,
  theme text default 'system' check (theme in ('light', 'dark', 'system')),
  language text default 'en',
  delivery_location text,
  delivery_pincode text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text default 'Home',
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean not null default false,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  order_number text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled', 'whatsapp')),
  payment_method text not null default 'whatsapp'
    check (payment_method in ('razorpay', 'cod', 'whatsapp', 'coins')),
  payment_id text,
  razorpay_order_id text,
  subtotal numeric(12, 2) not null default 0,
  discount numeric(12, 2) not null default 0,
  delivery_charge numeric(12, 2) not null default 0,
  platform_fee numeric(12, 2) not null default 0,
  coins_redeemed integer not null default 0,
  coins_earned integer not null default 0,
  grand_total numeric(12, 2) not null default 0,
  coupon_code text,
  shipping_address jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  size text,
  color text,
  quantity integer not null default 1,
  unit_price numeric(12, 2) not null,
  mrp numeric(12, 2) not null
);

create table if not exists public.jff_coins_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  delta integer not null,
  balance_after integer not null,
  reason text not null,
  order_id uuid references public.orders (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists jff_coins_ledger_user_idx on public.jff_coins_ledger (user_id, created_at desc);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_slug)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category text not null default 'offers'
    check (category in ('offers', 'orders', 'rewards', 'recommendations', 'restock')),
  title text not null,
  body text not null,
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.recently_viewed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_slug text not null,
  viewed_at timestamptz not null default now(),
  unique (user_id, product_slug)
);

create table if not exists public.user_offers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  code text not null,
  title text not null,
  description text,
  discount_label text not null,
  expires_at timestamptz,
  active boolean not null default true
);

-- Coin balance helper view
create or replace view public.jff_coin_balances as
select distinct on (user_id)
  user_id,
  balance_after as balance
from public.jff_coins_ledger
order by user_id, created_at desc;

-- Auto-create profile + welcome coins on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );

  insert into public.jff_coins_ledger (user_id, delta, balance_after, reason)
  values (new.id, 50, 50, 'welcome_bonus');

  insert into public.notifications (user_id, category, title, body, href)
  values (
    new.id,
    'rewards',
    'Welcome to JFF',
    'You earned 50 JFF Coins for joining. Shop premium slippers and earn more.',
    '/account/rewards'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.jff_coins_ledger enable row level security;
alter table public.wishlists enable row level security;
alter table public.notifications enable row level security;
alter table public.recently_viewed enable row level security;
alter table public.user_offers enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "addresses_all_own" on public.addresses;
drop policy if exists "orders_select_own" on public.orders;
drop policy if exists "orders_insert_own" on public.orders;
drop policy if exists "order_items_select_own" on public.order_items;
drop policy if exists "coins_select_own" on public.jff_coins_ledger;
drop policy if exists "wishlists_all_own" on public.wishlists;
drop policy if exists "notifications_all_own" on public.notifications;
drop policy if exists "recent_all_own" on public.recently_viewed;
drop policy if exists "offers_select" on public.user_offers;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "addresses_all_own" on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id);
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = user_id);

create policy "order_items_select_own" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

create policy "coins_select_own" on public.jff_coins_ledger for select using (auth.uid() = user_id);

create policy "wishlists_all_own" on public.wishlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "notifications_all_own" on public.notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "recent_all_own" on public.recently_viewed for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "offers_select" on public.user_offers for select
  using (user_id is null or auth.uid() = user_id);
