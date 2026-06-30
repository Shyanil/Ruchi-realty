-- ============================================================
-- Ruchi Realty — Complete Database Setup
-- Run this in Supabase SQL Editor (in order, all at once)
-- ============================================================

-- 1. Helper: auto-update updated_at on any table
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- 2. Profiles table (marks admin users)
create table if not exists public.profiles (
  id uuid not null primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin'::text check (role in ('admin', 'agent')),
  updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Auto-create profile when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'admin');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. is_admin() function used by RLS policies
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- 4. Enable RLS on tables & add policies
-- (These are idempotent — safe to re-run)

-- --- profiles ---
alter table public.profiles enable row level security;
drop policy if exists "Profiles readable by authenticated" on public.profiles;
create policy "Profiles readable by authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');

-- --- projects ---
alter table public.projects enable row level security;
drop policy if exists "Anyone can view projects" on public.projects;
create policy "Anyone can view projects" on public.projects
  for select using (true);
drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects" on public.projects
  for insert with check (public.is_admin());
drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects" on public.projects
  for update using (public.is_admin());
drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects" on public.projects
  for delete using (public.is_admin());

-- --- leads ---
alter table public.leads enable row level security;
drop policy if exists "Anyone can submit leads" on public.leads;
create policy "Anyone can submit leads" on public.leads
  for insert with check (true);
drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads" on public.leads
  for select using (public.is_admin());
drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads" on public.leads
  for update using (public.is_admin());
drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can delete leads" on public.leads
  for delete using (public.is_admin());

-- --- blogs ---
alter table public.blogs enable row level security;
drop policy if exists "Anyone can view blogs" on public.blogs;
create policy "Anyone can view blogs" on public.blogs
  for select using (true);
drop policy if exists "Admins can insert blogs" on public.blogs;
create policy "Admins can insert blogs" on public.blogs
  for insert with check (public.is_admin());
drop policy if exists "Admins can update blogs" on public.blogs;
create policy "Admins can update blogs" on public.blogs
  for update using (public.is_admin());
drop policy if exists "Admins can delete blogs" on public.blogs;
create policy "Admins can delete blogs" on public.blogs
  for delete using (public.is_admin());

-- --- site_settings ---
alter table public.site_settings enable row level security;
drop policy if exists "Anyone can view site_settings" on public.site_settings;
create policy "Anyone can view site_settings" on public.site_settings
  for select using (true);
drop policy if exists "Admins can insert site_settings" on public.site_settings;
create policy "Admins can insert site_settings" on public.site_settings
  for insert with check (public.is_admin());
drop policy if exists "Admins can update site_settings" on public.site_settings;
create policy "Admins can update site_settings" on public.site_settings
  for update using (public.is_admin());

-- --- career_jobs ---
alter table public.career_jobs enable row level security;
drop policy if exists "Anyone can view career_jobs" on public.career_jobs;
create policy "Anyone can view career_jobs" on public.career_jobs
  for select using (true);
drop policy if exists "Admins can insert career_jobs" on public.career_jobs;
create policy "Admins can insert career_jobs" on public.career_jobs
  for insert with check (public.is_admin());
drop policy if exists "Admins can update career_jobs" on public.career_jobs;
create policy "Admins can update career_jobs" on public.career_jobs
  for update using (public.is_admin());
drop policy if exists "Admins can delete career_jobs" on public.career_jobs;
create policy "Admins can delete career_jobs" on public.career_jobs
  for delete using (public.is_admin());

-- --- career_applications ---
alter table public.career_applications enable row level security;
drop policy if exists "Anyone can submit career applications" on public.career_applications;
create policy "Anyone can submit career applications" on public.career_applications
  for insert with check (true);
drop policy if exists "Admins can read career applications" on public.career_applications;
create policy "Admins can read career applications" on public.career_applications
  for select using (public.is_admin());
drop policy if exists "Admins can update career applications" on public.career_applications;
create policy "Admins can update career applications" on public.career_applications
  for update using (public.is_admin());
drop policy if exists "Admins can delete career applications" on public.career_applications;
create policy "Admins can delete career applications" on public.career_applications
  for delete using (public.is_admin());

-- ============================================================
-- 5. Create project_subpages table
-- ============================================================
create table if not exists public.project_subpages (
  id uuid not null default gen_random_uuid(),
  project_id uuid not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  hero_title text,
  hero_tagline text,
  hero_logo text,
  hero_bg text,
  overview_paragraphs jsonb not null default '[]'::jsonb,
  overview_highlights jsonb not null default '[]'::jsonb,
  amenities jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '[]'::jsonb,
  location_image text,
  location_map_embed text,
  location_destinations jsonb not null default '[]'::jsonb,
  walkthrough_video_id text,
  gallery_images jsonb not null default '[]'::jsonb,
  brochure_url text,
  meta_title text,
  meta_description text,
  is_published boolean not null default false,
  constraint project_subpages_pkey primary key (id),
  constraint project_subpages_project_id_fkey foreign key (project_id)
    references public.projects (id) on delete cascade,
  constraint project_subpages_project_id_unique unique (project_id)
);

create index if not exists idx_project_subpages_project_id
  on public.project_subpages using btree (project_id);

drop trigger if exists set_project_subpages_updated_at on public.project_subpages;
create trigger set_project_subpages_updated_at
  before update on public.project_subpages
  for each row execute function set_updated_at();

alter table public.project_subpages enable row level security;

drop policy if exists "Anyone can view published project subpages" on public.project_subpages;
create policy "Anyone can view published project subpages" on public.project_subpages
  for select using (is_published = true);

drop policy if exists "Admins can view all project subpages" on public.project_subpages;
create policy "Admins can view all project subpages" on public.project_subpages
  for select to authenticated using (true);

drop policy if exists "Admins can insert project subpages" on public.project_subpages;
create policy "Admins can insert project subpages" on public.project_subpages
  for insert to authenticated with check (true);

drop policy if exists "Admins can update project subpages" on public.project_subpages;
create policy "Admins can update project subpages" on public.project_subpages
  for update to authenticated using (true);

drop policy if exists "Admins can delete project subpages" on public.project_subpages;
create policy "Admins can delete project subpages" on public.project_subpages
  for delete to authenticated using (true);

-- ============================================================
-- 6. Seed data: insert sample subpage for "Oscar Billionaires"
--    Run AFTER you have created at least one project in the
--    admin panel (via Projects tab). Then replace the project_id
--    below with the actual UUID from public.projects.
-- ============================================================
-- To find the project_id:
--    select id, title from public.projects where title ilike '%oscar%';
--
-- Then copy the UUID and run the insert below.
-- Example:
--    insert into public.project_subpages (project_id, hero_title, hero_tagline, ...)
--    values ('the-uuid-from-above', 'Oscar / Oscar Billionaires', ...);

-- ============================================================
-- 7. Storage buckets
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-images', 'project-images', true, 204800, array['image/webp']),
  ('blog-images', 'blog-images', true, 204800, array['image/webp']),
  ('resumes', 'resumes', true, 30720, array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

-- Storage RLS
drop policy if exists "Public can read project-images" on storage.objects;
create policy "Public can read project-images" on storage.objects
  for select using (bucket_id = 'project-images');

drop policy if exists "Admins can upload project-images" on storage.objects;
create policy "Admins can upload project-images" on storage.objects
  for insert with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "Public can read blog-images" on storage.objects;
create policy "Public can read blog-images" on storage.objects
  for select using (bucket_id = 'blog-images');

drop policy if exists "Admins can upload blog-images" on storage.objects;
create policy "Admins can upload blog-images" on storage.objects
  for insert with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "Public can read resumes" on storage.objects;
create policy "Public can read resumes" on storage.objects
  for select using (bucket_id = 'resumes');

drop policy if exists "Anyone can upload resumes" on storage.objects;
create policy "Anyone can upload resumes" on storage.objects
  for insert with check (bucket_id = 'resumes');

-- ============================================================
-- 8. Site settings seed row
-- ============================================================
insert into public.site_settings (id) values (1) on conflict (id) do nothing;
