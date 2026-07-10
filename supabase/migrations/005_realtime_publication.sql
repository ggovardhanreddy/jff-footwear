-- Enable Supabase Realtime for admin-mutated tables
-- SAFE TO RE-RUN. Run AFTER 002/004.

-- Ensure tables are in the supabase_realtime publication
do $$
declare
  t text;
begin
  foreach t in array array[
    'catalog_products',
    'product_images',
    'banners',
    'coupons',
    'orders',
    'order_events',
    'notifications',
    'categories',
    'jff_coins_ledger'
  ]
  loop
    begin
      execute format(
        'alter publication supabase_realtime add table public.%I',
        t
      );
    exception
      when duplicate_object then null;
      when undefined_object then null;
      when others then null;
    end;
  end loop;
end $$;

-- Replica identity full so UPDATE/DELETE payloads include old row keys for clients
alter table public.catalog_products replica identity full;
alter table public.product_images replica identity full;
alter table public.banners replica identity full;
alter table public.coupons replica identity full;
alter table public.orders replica identity full;
alter table public.order_events replica identity full;
alter table public.notifications replica identity full;
alter table public.categories replica identity full;

do $$
begin
  alter table public.jff_coins_ledger replica identity full;
exception when others then null;
end $$;

-- Expo push / notification preference stub (no Firebase)
alter table public.profiles
  add column if not exists expo_push_token text;

alter table public.profiles
  add column if not exists notification_prefs jsonb;

update public.profiles
set notification_prefs = coalesce(
  notification_prefs,
  '{"offers":true,"orders":true,"rewards":true,"recommendations":true,"restock":true}'::jsonb
)
where notification_prefs is null;

alter table public.profiles
  alter column notification_prefs set default '{"offers":true,"orders":true,"rewards":true,"recommendations":true,"restock":true}'::jsonb;
