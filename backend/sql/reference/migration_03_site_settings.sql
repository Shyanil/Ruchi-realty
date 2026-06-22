-- Ruchi Realty — editable site / contact settings.
--
-- Run this ONCE in the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run).
--
-- Creates a single-row settings table the admin panel edits. The public site
-- (Contact page, footer, WhatsApp button, etc.) reads from it, falling back to
-- the built-in defaults in src/utils/constants.js until you save values.

create table if not exists public.site_settings (
  id            integer primary key default 1,
  site_name     text,
  phone         text,
  whatsapp      text,   -- digits only, e.g. 919875656616 (used for wa.me links)
  email         text,
  address       text,
  working_hours text,
  map_embed_url text,   -- Google Maps iframe "src" (…&output=embed)
  map_link      text,   -- normal Google Maps link ("open in maps")
  facebook      text,
  instagram     text,
  youtube       text,
  linkedin      text,
  updated_at    timestamptz not null default timezone('utc', now()),
  constraint site_settings_singleton check (id = 1)
);

-- Seed the single row (id = 1). Leaving columns null makes the site use its
-- built-in defaults; fill them in from the admin panel.
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- Public can read; only signed-in admins can change.
alter table public.site_settings enable row level security;

drop policy if exists site_settings_select on public.site_settings;
create policy site_settings_select on public.site_settings
  for select using (true);

drop policy if exists site_settings_insert on public.site_settings;
create policy site_settings_insert on public.site_settings
  for insert to authenticated with check (true);

drop policy if exists site_settings_update on public.site_settings;
create policy site_settings_update on public.site_settings
  for update to authenticated using (true) with check (true);
