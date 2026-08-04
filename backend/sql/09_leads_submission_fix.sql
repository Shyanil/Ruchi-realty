-- Ruchi Realty: public enquiry form repair
-- Run this once in Supabase Dashboard -> SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text not null,
  interest text not null default 'General',
  source text not null default 'Website',
  project_slug text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed', 'spam')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Supports existing databases where the table was created earlier with fewer columns.
alter table public.leads add column if not exists interest text;
alter table public.leads add column if not exists source text;
alter table public.leads add column if not exists project_slug text;
alter table public.leads add column if not exists status text;
alter table public.leads add column if not exists notes text;
alter table public.leads add column if not exists created_at timestamptz;
alter table public.leads add column if not exists updated_at timestamptz;

update public.leads
set interest = coalesce(nullif(interest, ''), 'General'),
    source = coalesce(nullif(source, ''), 'Website'),
    status = coalesce(nullif(status, ''), 'new'),
    created_at = coalesce(created_at, now()),
    updated_at = coalesce(updated_at, now());

alter table public.leads alter column interest set default 'General';
alter table public.leads alter column source set default 'Website';
alter table public.leads alter column status set default 'new';
alter table public.leads alter column created_at set default now();
alter table public.leads alter column updated_at set default now();
alter table public.leads alter column interest set not null;
alter table public.leads alter column source set not null;
alter table public.leads alter column status set not null;
alter table public.leads alter column created_at set not null;
alter table public.leads alter column updated_at set not null;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

create or replace function public.set_leads_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_leads_updated_at();

alter table public.leads enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on public.leads to anon, authenticated;
grant select, update, delete on public.leads to authenticated;

drop policy if exists "Anyone can submit a lead" on public.leads;
create policy "Anyone can submit a lead"
on public.leads
for insert
to anon, authenticated
with check (
  char_length(btrim(name)) between 2 and 120
  and char_length(btrim(phone)) between 5 and 40
  and char_length(coalesce(email, '')) <= 160
  and char_length(interest) <= 160
  and char_length(source) <= 200
  and char_length(coalesce(project_slug, '')) <= 160
  and char_length(coalesce(notes, '')) <= 5000
  and status = 'new'
);

-- The existing complete setup already defines public.is_admin().
-- This policy keeps submitted leads private while allowing only admins to manage them.
drop policy if exists "Admins manage leads" on public.leads;
create policy "Admins manage leads"
on public.leads
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());