-- Promote store owner to admin (run AFTER 002_catalog_admin.sql)
-- Email matches COMPANY.email in packages/config

update public.profiles
set role = 'admin'
where email = 'govardhan.reddy.g.94@gmail.com';
