-- AI product analyzer fields + product-images Storage bucket
-- SAFE TO RE-RUN (idempotent). Run AFTER 002_catalog_admin.sql.

-- Extended catalog fields for AI-generated product copy
alter table public.catalog_products
  add column if not exists short_description text;

alter table public.catalog_products
  add column if not exists long_description text;

alter table public.catalog_products
  add column if not exists features jsonb;

alter table public.catalog_products
  add column if not exists specifications jsonb;

alter table public.catalog_products
  add column if not exists seo jsonb;

alter table public.catalog_products
  add column if not exists tags text[];

alter table public.catalog_products
  add column if not exists ai_confidence jsonb;

alter table public.catalog_products
  add column if not exists ai_needs_review boolean;

alter table public.catalog_products
  add column if not exists ai_raw jsonb;

update public.catalog_products
set ai_needs_review = false
where ai_needs_review is null;

alter table public.catalog_products
  alter column ai_needs_review set default false;

do $$
begin
  alter table public.catalog_products alter column ai_needs_review set not null;
exception when others then null;
end $$;

-- Storage bucket for admin product uploads (public read, admin write)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_admin_insert" on storage.objects;
drop policy if exists "product_images_admin_update" on storage.objects;
drop policy if exists "product_images_admin_delete" on storage.objects;

create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
