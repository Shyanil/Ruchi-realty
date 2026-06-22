-- Ruchi Realty — add ordering columns to the projects table.
--
-- Run this ONCE in the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run).
--
-- Why: the admin panel and the public site control project order with two
-- numbers — sort_order (Projects page grid) and feature_order (home Featured
-- carousel). Lower number shows first. Until these columns exist, adding or
-- editing a project from the admin panel will fail.

alter table public.projects
  add column if not exists sort_order   integer,
  add column if not exists feature_order integer;

-- Optional: helps ordered reads stay fast as the catalogue grows.
create index if not exists projects_sort_order_idx    on public.projects (sort_order);
create index if not exists projects_feature_order_idx on public.projects (feature_order);
