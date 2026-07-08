-- Fix project ordering columns used by the admin panel.
-- Run this in Supabase SQL Editor if Sort order / Feature order do not save or order correctly.

alter table public.projects
  add column if not exists featured boolean not null default false,
  add column if not exists sort_order integer,
  add column if not exists feature_order integer;

create index if not exists idx_projects_sort_order
  on public.projects (sort_order asc nulls last, created_at desc);

create index if not exists idx_projects_feature_order
  on public.projects (feature_order asc nulls last, sort_order asc nulls last, created_at desc)
  where featured = true;

-- Optional sanity check after running:
-- select title, featured, sort_order, feature_order from public.projects order by sort_order asc nulls last, created_at desc;