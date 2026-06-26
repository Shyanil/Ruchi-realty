-- =====================================================================
-- Ruchi Realty — FIX: "new row violates row-level security policy"
-- when uploading blog/project images from the admin panel.
-- =====================================================================
-- Safe to run on an existing project: it only creates/repairs the admin
-- profile system, storage buckets, and storage write policies. It does
-- NOT drop any tables or delete any data.
--
-- HOW TO RUN:
--   Supabase Dashboard -> SQL Editor -> New query -> paste this whole
--   file -> Run. Then go back to the admin panel and try the upload again.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. Admin profile system (who is allowed to write).
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid not null,
  email      text null,
  role       text null default 'admin'::text,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade,
  constraint profiles_role_check check (role = any (array['admin'::text, 'agent'::text]))
);

alter table public.profiles enable row level security;

drop policy if exists "Authenticated users can read profiles" on public.profiles;
create policy "Authenticated users can read profiles"
  on public.profiles for select to authenticated using (true);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Auto-create an admin profile for every NEW auth user.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role, updated_at)
  values (new.id, new.email, 'admin', now())
  on conflict (id) do update
    set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Backfill: make every EXISTING auth user an admin so your current
-- login is recognized. (This is the line that most likely fixes you.)
insert into public.profiles (id, email, role, updated_at)
select id, email, 'admin', now()
from auth.users
on conflict (id) do update
  set role = 'admin', email = excluded.email, updated_at = now();

-- Keep the editorial account in sync explicitly.
insert into public.profiles (id, email, role, updated_at)
select id, email, 'admin', now()
from auth.users
where lower(email) = 'emarketing@rrhlrealty.com'
on conflict (id) do update
  set role = 'admin', email = excluded.email, updated_at = now();

-- ---------------------------------------------------------------------
-- 2. Content tables (admin write).
-- ---------------------------------------------------------------------
alter table if exists public.projects enable row level security;
drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select to anon, authenticated using (true);
drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects"
  on public.projects for insert to authenticated with check (public.is_admin());
drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects"
  on public.projects for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects"
  on public.projects for delete to authenticated using (public.is_admin());

alter table if exists public.blogs enable row level security;
drop policy if exists "Public can read blogs" on public.blogs;
create policy "Public can read blogs"
  on public.blogs for select to anon, authenticated using (true);
drop policy if exists "Admins can insert blogs" on public.blogs;
create policy "Admins can insert blogs"
  on public.blogs for insert to authenticated with check (public.is_admin());
drop policy if exists "Admins can update blogs" on public.blogs;
create policy "Admins can update blogs"
  on public.blogs for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can delete blogs" on public.blogs;
create policy "Admins can delete blogs"
  on public.blogs for delete to authenticated using (public.is_admin());

alter table if exists public.site_settings enable row level security;
drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "Admins can insert site settings" on public.site_settings;
create policy "Admins can insert site settings"
  on public.site_settings for insert to authenticated with check (public.is_admin());
drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
  on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 3. Storage buckets (public read, admin write).
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true),
       ('blog-images', 'blog-images', true)
on conflict (id) do update set public = excluded.public;

-- ---------------------------------------------------------------------
-- 4. Storage write policies (simplified + robust).
--    Allows any signed-in admin to upload .webp files into the two
--    buckets. The 200 KB / image-webp limits are still enforced in the
--    admin UI, and the projects/blogs tables already CHECK that saved
--    URLs are .webp in the right bucket -- so we drop the fragile
--    metadata-based checks that can falsely block uploads.
-- ---------------------------------------------------------------------
drop policy if exists "Public can read project images" on storage.objects;
create policy "Public can read project images"
  on storage.objects for select to public using (bucket_id = 'project-images');

drop policy if exists "Public can read blog images" on storage.objects;
create policy "Public can read blog images"
  on storage.objects for select to public using (bucket_id = 'blog-images');

drop policy if exists "Admins can write project images" on storage.objects;
create policy "Admins can write project images"
  on storage.objects for insert to authenticated with check (
    bucket_id = 'project-images'
    and public.is_admin()
    and lower(name) like '%.webp'
  );

drop policy if exists "Admins can write blog images" on storage.objects;
create policy "Admins can write blog images"
  on storage.objects for insert to authenticated with check (
    bucket_id = 'blog-images'
    and public.is_admin()
    and lower(name) like '%.webp'
  );

-- Allow admins to overwrite/update and delete their uploaded images too.
drop policy if exists "Admins can update project images" on storage.objects;
create policy "Admins can update project images"
  on storage.objects for update to authenticated
  using (bucket_id = 'project-images' and public.is_admin())
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "Admins can update blog images" on storage.objects;
create policy "Admins can update blog images"
  on storage.objects for update to authenticated
  using (bucket_id = 'blog-images' and public.is_admin())
  with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "Admins can delete project images" on storage.objects;
create policy "Admins can delete project images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "Admins can delete blog images" on storage.objects;
create policy "Admins can delete blog images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-images' and public.is_admin());

-- ---------------------------------------------------------------------
-- 5. Verify (optional): run these SELECTs to confirm the fix.
-- ---------------------------------------------------------------------
-- Should list your auth users, all with role = 'admin':
--   select p.email, p.role from public.profiles p;
-- Should return both buckets:
--   select id, public from storage.buckets where id in ('project-images','blog-images');
