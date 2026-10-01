-- Fix lead verification and mobile OTP persistence in Supabase
-- Run this script once in Supabase Dashboard -> SQL Editor

-- 1. Ensure required lead verification columns exist
alter table public.leads add column if not exists city text;
alter table public.leads add column if not exists lead_action text not null default 'callback';
alter table public.leads add column if not exists verification_status text not null default 'unverified';
alter table public.leads add column if not exists verified_at timestamptz;
alter table public.leads add column if not exists crm_status text not null default 'not_sent';
alter table public.leads add column if not exists crm_sent_at timestamptz;
alter table public.leads add column if not exists crm_error text;

-- 2. Validate column constraints
alter table public.leads drop constraint if exists leads_verification_status_check;
alter table public.leads add constraint leads_verification_status_check
  check (verification_status in ('unverified', 'verified'));

alter table public.leads drop constraint if exists leads_crm_status_check;
alter table public.leads add constraint leads_crm_status_check
  check (crm_status in ('not_sent', 'pending', 'sent', 'failed'));

-- 3. Grants for schema and table access
grant usage on schema public to anon, authenticated, service_role;
grant select, insert on public.leads to anon;
grant update (verification_status, verified_at, crm_status, crm_sent_at, crm_error, updated_at) on public.leads to anon;
grant all on public.leads to authenticated;
grant all on public.leads to service_role;

-- 4. Ensure RLS policies allow lead verification updates
-- A. Service role unrestricted access
drop policy if exists "Service role full access on leads" on public.leads;
create policy "Service role full access on leads"
on public.leads
for all
to service_role
using (true)
with check (true);

-- B. Admins manage all leads
drop policy if exists "Admins manage leads" on public.leads;
create policy "Admins manage leads"
on public.leads
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- C. Anonymous / server OTP verification update (permits setting verification_status to 'verified')
drop policy if exists "Allow OTP verification update" on public.leads;
create policy "Allow OTP verification update"
on public.leads
for update
to anon, authenticated, service_role
using (true)
with check (verification_status in ('unverified', 'verified'));

-- 5. Stored procedure with SECURITY DEFINER to atomically verify lead by ID & mobile
create or replace function public.verify_lead_by_otp(
  p_lead_id uuid,
  p_mobile text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead public.leads%rowtype;
  v_clean_phone text;
  v_lead_phone text;
begin
  select * into v_lead from public.leads where id = p_lead_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'Lead not found');
  end if;

  -- Optional mobile verification check if mobile parameter is supplied
  if p_mobile is not null and btrim(p_mobile) <> '' then
    v_clean_phone := regexp_replace(p_mobile, '\D', '', 'g');
    if length(v_clean_phone) = 12 and v_clean_phone like '91%' then
      v_clean_phone := substr(v_clean_phone, 3);
    end if;

    v_lead_phone := regexp_replace(coalesce(v_lead.phone, ''), '\D', '', 'g');
    if length(v_lead_phone) = 12 and v_lead_phone like '91%' then
      v_lead_phone := substr(v_lead_phone, 3);
    end if;

    if v_clean_phone <> '' and v_lead_phone <> '' and v_clean_phone <> v_lead_phone then
      return jsonb_build_object('success', false, 'error', 'Phone number mismatch');
    end if;
  end if;

  update public.leads
  set verification_status = 'verified',
      verified_at = coalesce(verified_at, now()),
      crm_status = case when crm_status = 'not_sent' then 'pending' else crm_status end,
      updated_at = now()
  where id = p_lead_id
  returning * into v_lead;

  return jsonb_build_object('success', true, 'lead', row_to_json(v_lead));
end;
$$;

-- Grant execution to all roles
grant execute on function public.verify_lead_by_otp(uuid, text) to anon, authenticated, service_role;
