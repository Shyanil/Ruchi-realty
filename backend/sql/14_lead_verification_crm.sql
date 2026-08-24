-- Two-stage lead capture: save first, verify by OTP, then forward to CRM.
-- Run once in Supabase Dashboard -> SQL Editor before deploying the matching frontend.

alter table public.leads add column if not exists city text;
alter table public.leads add column if not exists lead_action text not null default 'callback';
alter table public.leads add column if not exists verification_status text not null default 'unverified';
alter table public.leads add column if not exists verified_at timestamptz;
alter table public.leads add column if not exists crm_status text not null default 'not_sent';
alter table public.leads add column if not exists crm_sent_at timestamptz;
alter table public.leads add column if not exists crm_error text;

alter table public.leads drop constraint if exists leads_verification_status_check;
alter table public.leads add constraint leads_verification_status_check
  check (verification_status in ('unverified', 'verified'));

alter table public.leads drop constraint if exists leads_crm_status_check;
alter table public.leads add constraint leads_crm_status_check
  check (crm_status in ('not_sent', 'pending', 'sent', 'failed'));

alter table public.leads drop constraint if exists leads_lead_action_check;
alter table public.leads add constraint leads_lead_action_check
  check (lead_action in ('callback', 'project_details', 'brochure'));

create index if not exists leads_verification_status_idx
  on public.leads (verification_status, created_at desc);
create index if not exists leads_crm_status_idx
  on public.leads (crm_status, created_at desc);

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
  and char_length(coalesce(city, '')) <= 120
  and lead_action in ('callback', 'project_details', 'brochure')
  and char_length(coalesce(notes, '')) <= 5000
  and status = 'new'
  and verification_status = 'unverified'
  and verified_at is null
  and crm_status = 'not_sent'
  and crm_sent_at is null
  and crm_error is null
);

comment on column public.leads.verification_status is
  'unverified after initial capture; verified only by the server after successful OTP verification';
comment on column public.leads.crm_status is
  'Only verified leads are eligible for server-side CRM forwarding';
