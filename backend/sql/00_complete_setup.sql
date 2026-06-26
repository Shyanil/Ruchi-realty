-- =====================================================================
-- Ruchi Realty — COMPLETE Supabase backend setup (final schema)
-- =====================================================================
-- Run this ONCE in a fresh Supabase project:
--   Dashboard → SQL Editor → New query → paste this whole file → Run.
--
-- This is the full, final schema (all migrations already folded in), so a new
-- project gets everything in one shot. Tables created:
--   profiles, projects, leads, blogs, blog_comments, site_settings
-- Plus: is_admin() helper, RLS policies, and storage buckets.
--
-- Image rules for admin uploads:
--   project images: Supabase Storage bucket `project-images`, .webp only,
--                   image/webp MIME type, 200 KB max.
--   blog images:    Supabase Storage bucket `blog-images`, .webp only,
--                   image/webp MIME type, 200 KB max.
--
-- BEFORE RUNNING:
--   1. Keep public signups disabled unless you want every new Auth user to be
--      able to use the admin panel.
--   2. Create users in Authentication → Users. This script automatically creates
--      matching public.profiles rows with role = 'admin' for Auth users, so the
--      admin login calls Supabase Auth directly.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- profiles — one row per auth user; marks who is an admin/agent.
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

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public as $$
begin
  insert into public.profiles (id, email, role, updated_at)
  values (new.id, new.email, 'admin', now())
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

insert into public.profiles (id, email, role, updated_at)
select id, email, 'admin', now()
from auth.users
on conflict (id) do update
  set email = excluded.email,
      updated_at = now();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- projects — property catalogue (admin-managed).
-- Admins can add future projects and edit all fields, including title,
-- tag, image_url, location, description, type, status, featured,
-- sort_order, and feature_order.
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id            uuid not null default gen_random_uuid(),
  created_at    timestamptz not null default timezone('utc'::text, now()),
  updated_at    timestamptz not null default timezone('utc'::text, now()),
  title         text not null,
  tag           text not null,
  image_url     text not null,
  location      text not null,
  description   text null,
  type          text not null,
  status        text null,          -- badge: For Sale / New Launch / Ongoing / ...
  featured      boolean null default false,
  sort_order    integer null,       -- order on the Projects page (lower = first)
  feature_order integer null,       -- order in the home Featured carousel
  constraint projects_pkey primary key (id),
  constraint projects_type_check check (
    type = any (array['Residential'::text, 'Commercial'::text, 'Township'::text, 'Land'::text, 'Leasing'::text])
  )
);

alter table public.projects
  add column if not exists updated_at timestamptz not null default timezone('utc'::text, now());

alter table public.projects drop constraint if exists projects_image_url_storage_webp_check;
alter table public.projects add constraint projects_image_url_storage_webp_check
  check (
    image_url like '%/storage/v1/object/public/project-images/%'
    and lower(image_url) like '%.webp'
  );

create index if not exists projects_sort_order_idx    on public.projects (sort_order);
create index if not exists projects_feature_order_idx on public.projects (feature_order);

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

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

-- ---------------------------------------------------------------------
-- leads — enquiry submissions from every form on the site.
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id           uuid not null default gen_random_uuid(),
  created_at   timestamptz not null default timezone('utc'::text, now()),
  name         text not null,
  email        text not null,
  phone        text not null,
  interest     text not null,
  source       text null,          -- which form/page (e.g. "Project Detail")
  project_slug text null,          -- specific project the enquiry is about
  status       text null default 'new'::text,
  notes        text null,
  constraint leads_pkey primary key (id),
  constraint leads_status_check check (
    status = any (array['new'::text, 'contacted'::text, 'qualified'::text, 'lost'::text, 'closed'::text])
  )
);

alter table public.leads enable row level security;

drop policy if exists "Anyone can insert leads" on public.leads;
create policy "Anyone can insert leads"
  on public.leads for insert to anon, authenticated with check (true);

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
  on public.leads for select to authenticated using (public.is_admin());

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
  on public.leads for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can delete leads"
  on public.leads for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------
-- blogs — articles (admin-managed).
-- ---------------------------------------------------------------------
create table if not exists public.blogs (
  id           uuid not null default gen_random_uuid(),
  created_at   timestamptz not null default timezone('utc'::text, now()),
  title        text not null,
  slug         text not null,
  excerpt      text not null,
  content      text not null,
  author       text null default 'Admin'::text,
  image        text not null,
  tags         text[] null default array[]::text[],
  category     text not null default 'News',
  featured     boolean not null default false,
  published_at timestamptz not null default timezone('utc'::text, now()),
  constraint blogs_pkey primary key (id),
  constraint blogs_slug_key unique (slug),
  constraint blogs_category_check check (
    category = any (array['News'::text, 'Buying Guide'::text, 'Market Trends'::text, 'Investment'::text])
  )
);

alter table public.blogs drop constraint if exists blogs_image_storage_webp_check;
alter table public.blogs add constraint blogs_image_storage_webp_check
  check (
    image like '%/storage/v1/object/public/blog-images/%'
    and lower(image) like '%.webp'
  );

create index if not exists blogs_category_idx on public.blogs using btree (category);
create index if not exists blogs_featured_idx on public.blogs using btree (featured);

alter table public.blogs enable row level security;

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

-- ---------------------------------------------------------------------
-- blog_comments — public submissions, admin moderation.
-- ---------------------------------------------------------------------
create table if not exists public.blog_comments (
  id          uuid not null default gen_random_uuid(),
  blog_id     uuid not null,
  created_at  timestamptz not null default timezone('utc'::text, now()),
  updated_at  timestamptz not null default timezone('utc'::text, now()),
  name        text not null,
  email       text not null,
  comment     text not null,
  status      text not null default 'pending'::text,
  admin_notes text null,
  constraint blog_comments_pkey primary key (id),
  constraint blog_comments_blog_id_fkey foreign key (blog_id) references public.blogs (id) on delete cascade,
  constraint blog_comments_status_check check (
    status = any (array['pending'::text, 'approved'::text, 'rejected'::text, 'spam'::text])
  )
);

create index if not exists blog_comments_blog_id_idx    on public.blog_comments using btree (blog_id);
create index if not exists blog_comments_status_idx     on public.blog_comments using btree (status);
create index if not exists blog_comments_created_at_idx on public.blog_comments using btree (created_at desc);

drop trigger if exists set_blog_comments_updated_at on public.blog_comments;
create trigger set_blog_comments_updated_at
  before update on public.blog_comments
  for each row execute function public.set_updated_at();

alter table public.blog_comments enable row level security;

drop policy if exists "Public can read approved blog comments" on public.blog_comments;
create policy "Public can read approved blog comments"
  on public.blog_comments for select to anon, authenticated using (status = 'approved');

drop policy if exists "Public can submit pending blog comments" on public.blog_comments;
create policy "Public can submit pending blog comments"
  on public.blog_comments for insert to anon, authenticated with check (status = 'pending');

drop policy if exists "Admins can read all blog comments" on public.blog_comments;
create policy "Admins can read all blog comments"
  on public.blog_comments for select to authenticated using (public.is_admin());

drop policy if exists "Admins can update blog comments" on public.blog_comments;
create policy "Admins can update blog comments"
  on public.blog_comments for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete blog comments" on public.blog_comments;
create policy "Admins can delete blog comments"
  on public.blog_comments for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------
-- site_settings — single-row, admin-editable contact / site config.
-- ---------------------------------------------------------------------
create table if not exists public.site_settings (
  id            integer primary key default 1,
  site_name     text,
  phone         text,
  whatsapp      text,   -- digits only, e.g. 919875656616 (used for wa.me links)
  email         text,
  address       text,
  working_hours text,
  map_embed_url text,   -- Google Maps iframe "src" (…&output=embed)
  map_link      text,   -- normal Google Maps link
  facebook      text,
  instagram     text,
  youtube       text,
  linkedin      text,
  updated_at    timestamptz not null default timezone('utc', now()),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

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
-- Supabase Storage buckets.
-- The admin panel uploads project/blog images here and stores the returned
-- public URL in the database.
-- Strict upload rule: WebP only and 200 KB max. Prepare/compress images before
-- uploading from the admin panel.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true),
       ('blog-images', 'blog-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read project images" on storage.objects;
create policy "Public can read project images"
  on storage.objects for select to public using (bucket_id = 'project-images');

drop policy if exists "Admins can write project images" on storage.objects;
create policy "Admins can write project images"
  on storage.objects for insert to authenticated with check (
    bucket_id = 'project-images'
    and public.is_admin()
    and lower(name) like '%.webp'
    and metadata ? 'mimetype'
    and (metadata->>'mimetype') = 'image/webp'
    and case
      when metadata ? 'size' and (metadata->>'size') ~ '^[0-9]+$'
        then (metadata->>'size')::bigint <= 204800
      else false
    end
  );

drop policy if exists "Public can read blog images" on storage.objects;
create policy "Public can read blog images"
  on storage.objects for select to public using (bucket_id = 'blog-images');

drop policy if exists "Admins can write blog images" on storage.objects;
create policy "Admins can write blog images"
  on storage.objects for insert to authenticated with check (
    bucket_id = 'blog-images'
    and public.is_admin()
    and lower(name) like '%.webp'
    and metadata ? 'mimetype'
    and (metadata->>'mimetype') = 'image/webp'
    and case
      when metadata ? 'size' and (metadata->>'size') ~ '^[0-9]+$'
        then (metadata->>'size')::bigint <= 204800
      else false
    end
  );
