-- Ruchi Realty Supabase setup (historical reference)
-- Paste only SQL into Supabase SQL Editor. Do not paste markdown text.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Profiles: one row per auth.users user, used to identify admin/agent users.
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid not null,
  email text null,
  role text null default 'admin'::text,
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade,
  constraint profiles_role_check check (role = any (array['admin'::text, 'agent'::text]))
);

alter table public.profiles enable row level security;

drop policy if exists "Authenticated users can read profiles" on public.profiles;
create policy "Authenticated users can read profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Link the admin user (created in Supabase Authentication) to an admin profile.
-- The password is managed by Supabase Auth and is never stored here.
-- This looks the user up by email, so no UUID needs to be copied by hand.
insert into public.profiles (id, email, role, updated_at)
select id, email, 'admin', now()
from auth.users
where email = 'YOUR_ADMIN_EMAIL@example.com'
on conflict (id) do update
set
  email = excluded.email,
  role = 'admin',
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Projects: exact schema used by the admin project form.
-- ---------------------------------------------------------------------------

create table if not exists public.projects (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  title text not null,
  tag text not null,
  image_url text not null,
  location text not null,
  description text null,
  type text not null,
  featured boolean null default false,
  constraint projects_pkey primary key (id),
  constraint projects_type_check check (
    type = any (
      array[
        'Residential'::text,
        'Commercial'::text,
        'Land'::text,
        'Leasing'::text
      ]
    )
  )
);

-- Migration for existing databases: add the project description column.
alter table public.projects
  add column if not exists description text;

alter table public.projects enable row level security;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects"
  on public.projects
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects"
  on public.projects
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Leads: exact schema used by admin lead management.
-- ---------------------------------------------------------------------------

create table if not exists public.leads (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  name text not null,
  email text not null,
  phone text not null,
  interest text not null,
  status text null default 'new'::text,
  notes text null,
  constraint leads_pkey primary key (id),
  constraint leads_status_check check (
    status = any (
      array[
        'new'::text,
        'contacted'::text,
        'qualified'::text,
        'lost'::text,
        'closed'::text
      ]
    )
  )
);

alter table public.leads enable row level security;

drop policy if exists "Anyone can insert leads" on public.leads;
create policy "Anyone can insert leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
  on public.leads
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
  on public.leads
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can delete leads"
  on public.leads
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Blogs: exact schema used by the admin blog form.
-- ---------------------------------------------------------------------------

create table if not exists public.blogs (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  title text not null,
  slug text not null,
  excerpt text not null,
  content text not null,
  author text null default 'Admin'::text,
  image text not null,
  tags text[] null default array[]::text[],
  category text not null default 'News',
  featured boolean not null default false,
  published_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint blogs_pkey primary key (id),
  constraint blogs_slug_key unique (slug),
  constraint blogs_category_check check (
    category = any (array['News'::text, 'Buying Guide'::text, 'Market Trends'::text, 'Investment'::text])
  )
);

alter table public.blogs
  add column if not exists category text not null default 'News';

alter table public.blogs
  add column if not exists featured boolean not null default false;

create index if not exists blogs_category_idx
  on public.blogs using btree (category);

create index if not exists blogs_featured_idx
  on public.blogs using btree (featured);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'blogs_category_check'
      and conrelid = 'public.blogs'::regclass
  ) then
    alter table public.blogs
      add constraint blogs_category_check
      check (category = any (array['News'::text, 'Buying Guide'::text, 'Market Trends'::text, 'Investment'::text]));
  end if;
end $$;

alter table public.blogs enable row level security;

drop policy if exists "Public can read blogs" on public.blogs;
create policy "Public can read blogs"
  on public.blogs
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert blogs" on public.blogs;
create policy "Admins can insert blogs"
  on public.blogs
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update blogs" on public.blogs;
create policy "Admins can update blogs"
  on public.blogs
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete blogs" on public.blogs;
create policy "Admins can delete blogs"
  on public.blogs
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Blog comments: public submissions, approved public display, admin moderation.
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create table if not exists public.blog_comments (
  id uuid not null default gen_random_uuid(),
  blog_id uuid not null,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  name text not null,
  email text not null,
  comment text not null,
  status text not null default 'pending'::text,
  admin_notes text null,
  constraint blog_comments_pkey primary key (id),
  constraint blog_comments_blog_id_fkey foreign key (blog_id) references public.blogs (id) on delete cascade,
  constraint blog_comments_status_check check (
    status = any (array['pending'::text, 'approved'::text, 'rejected'::text, 'spam'::text])
  )
);

create index if not exists blog_comments_blog_id_idx
  on public.blog_comments using btree (blog_id);

create index if not exists blog_comments_status_idx
  on public.blog_comments using btree (status);

create index if not exists blog_comments_created_at_idx
  on public.blog_comments using btree (created_at desc);

drop trigger if exists set_blog_comments_updated_at on public.blog_comments;
create trigger set_blog_comments_updated_at
  before update on public.blog_comments
  for each row
  execute function public.set_updated_at();

alter table public.blog_comments enable row level security;

drop policy if exists "Public can read approved blog comments" on public.blog_comments;
create policy "Public can read approved blog comments"
  on public.blog_comments
  for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "Public can submit pending blog comments" on public.blog_comments;
create policy "Public can submit pending blog comments"
  on public.blog_comments
  for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Admins can read all blog comments" on public.blog_comments;
create policy "Admins can read all blog comments"
  on public.blog_comments
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update blog comments" on public.blog_comments;
create policy "Admins can update blog comments"
  on public.blog_comments
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete blog comments" on public.blog_comments;
create policy "Admins can delete blog comments"
  on public.blog_comments
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage buckets: admin upload forms require public image buckets.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values
  ('project-images', 'project-images', true),
  ('blog-images', 'blog-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read project images" on storage.objects;
create policy "Public can read project images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'project-images');

drop policy if exists "Admins can upload project images" on storage.objects;
create policy "Admins can upload project images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "Admins can update project images" on storage.objects;
create policy "Admins can update project images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin())
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "Admins can delete project images" on storage.objects;
create policy "Admins can delete project images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "Public can read blog images" on storage.objects;
create policy "Public can read blog images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'blog-images');

drop policy if exists "Admins can upload blog images" on storage.objects;
create policy "Admins can upload blog images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "Admins can update blog images" on storage.objects;
create policy "Admins can update blog images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'blog-images' and public.is_admin())
  with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "Admins can delete blog images" on storage.objects;
create policy "Admins can delete blog images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'blog-images' and public.is_admin());
