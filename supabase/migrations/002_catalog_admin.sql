-- JFF schema expansion — products, inventory, reviews, admin roles
-- SAFE TO RE-RUN (idempotent). Run AFTER 001_jff_schema.sql only.
-- Do NOT re-run 001 — that causes "policy already exists" errors.

-- Admin role on profiles
alter table public.profiles
  add column if not exists role text;

alter table public.profiles
  add column if not exists is_wholesale boolean;

update public.profiles set role = 'customer' where role is null;
update public.profiles set is_wholesale = false where is_wholesale is null;

alter table public.profiles
  alter column role set default 'customer';
alter table public.profiles
  alter column is_wholesale set default false;

do $$
begin
  alter table public.profiles alter column role set not null;
exception when others then null;
end $$;

do $$
begin
  alter table public.profiles alter column is_wholesale set not null;
exception when others then null;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role in ('customer', 'admin', 'wholesale'));
  end if;
end $$;

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  category_id uuid references public.categories (id) on delete set null,
  gender text,
  material text,
  color text,
  mrp numeric(12, 2) not null default 299,
  selling_price numeric(12, 2) not null default 120,
  featured boolean not null default false,
  new_arrival boolean not null default false,
  active boolean not null default true,
  stock_total integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products (id) on delete cascade,
  url text not null,
  alt text,
  sort_order integer not null default 0,
  is_primary boolean not null default false
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products (id) on delete cascade,
  size text,
  color text,
  material text,
  strap text,
  sku text,
  stock integer not null default 0,
  unique (product_id, size, color, material, strap)
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid references public.product_variants (id) on delete set null,
  product_id uuid references public.catalog_products (id) on delete cascade,
  delta integer not null,
  reason text not null default 'adjust',
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  user_id uuid references public.profiles (id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  type text not null check (type in ('flat', 'percent')),
  discount numeric(12, 2) not null,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions integer,
  created_at timestamptz not null default now()
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  href text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

alter table public.categories enable row level security;
alter table public.catalog_products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;
alter table public.banners enable row level security;
alter table public.admin_settings enable row level security;
alter table public.order_events enable row level security;

-- Drop then recreate so this script is safe to re-run
drop policy if exists "categories_public_read" on public.categories;
drop policy if exists "products_public_read" on public.catalog_products;
drop policy if exists "images_public_read" on public.product_images;
drop policy if exists "variants_public_read" on public.product_variants;
drop policy if exists "reviews_public_read" on public.reviews;
drop policy if exists "coupons_public_read" on public.coupons;
drop policy if exists "banners_public_read" on public.banners;
drop policy if exists "reviews_insert_own" on public.reviews;
drop policy if exists "order_events_select_own" on public.order_events;
drop policy if exists "categories_admin_all" on public.categories;
drop policy if exists "products_admin_all" on public.catalog_products;
drop policy if exists "images_admin_all" on public.product_images;
drop policy if exists "variants_admin_all" on public.product_variants;
drop policy if exists "inventory_admin_all" on public.inventory_movements;
drop policy if exists "reviews_admin_all" on public.reviews;
drop policy if exists "coupons_admin_all" on public.coupons;
drop policy if exists "banners_admin_all" on public.banners;
drop policy if exists "settings_admin_all" on public.admin_settings;
drop policy if exists "order_events_admin_all" on public.order_events;
drop policy if exists "orders_admin_select" on public.orders;
drop policy if exists "orders_admin_update" on public.orders;
drop policy if exists "profiles_admin_select" on public.profiles;
drop policy if exists "profiles_admin_update" on public.profiles;

create policy "categories_public_read" on public.categories for select using (active = true or public.is_admin());
create policy "products_public_read" on public.catalog_products for select using (active = true or public.is_admin());
create policy "images_public_read" on public.product_images for select using (true);
create policy "variants_public_read" on public.product_variants for select using (true);
create policy "reviews_public_read" on public.reviews for select using (approved = true or auth.uid() = user_id or public.is_admin());
create policy "coupons_public_read" on public.coupons for select using (active = true or public.is_admin());
create policy "banners_public_read" on public.banners for select using (active = true or public.is_admin());
create policy "reviews_insert_own" on public.reviews for insert with check (auth.uid() = user_id);
create policy "order_events_select_own" on public.order_events for select
  using (
    public.is_admin()
    or exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "categories_admin_all" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "products_admin_all" on public.catalog_products for all using (public.is_admin()) with check (public.is_admin());
create policy "images_admin_all" on public.product_images for all using (public.is_admin()) with check (public.is_admin());
create policy "variants_admin_all" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());
create policy "inventory_admin_all" on public.inventory_movements for all using (public.is_admin()) with check (public.is_admin());
create policy "reviews_admin_all" on public.reviews for all using (public.is_admin()) with check (public.is_admin());
create policy "coupons_admin_all" on public.coupons for all using (public.is_admin()) with check (public.is_admin());
create policy "banners_admin_all" on public.banners for all using (public.is_admin()) with check (public.is_admin());
create policy "settings_admin_all" on public.admin_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "order_events_admin_all" on public.order_events for all using (public.is_admin()) with check (public.is_admin());
create policy "orders_admin_select" on public.orders for select using (public.is_admin());
create policy "orders_admin_update" on public.orders for update using (public.is_admin());
create policy "profiles_admin_select" on public.profiles for select using (public.is_admin());
create policy "profiles_admin_update" on public.profiles for update using (public.is_admin());

insert into public.coupons (code, label, type, discount)
values
  ('JFF20', '₹20 off', 'flat', 20),
  ('WELCOME10', '10% off', 'percent', 10)
on conflict (code) do nothing;

insert into public.admin_settings (key, value)
values ('store', '{"cod_enabled": true, "whatsapp_checkout": true}'::jsonb)
on conflict (key) do nothing;

-- Promote store owner
update public.profiles
set role = 'admin'
where email = 'govardhan.reddy.g.94@gmail.com';
