-- Lead capture forms verify a phone number and do not require an email address.
-- Run once in Supabase Dashboard -> SQL Editor.

alter table public.leads
  alter column email drop not null;

comment on column public.leads.email is
  'Optional email address; phone-first lead forms may leave this null.';

-- Verification query: is_nullable should return YES.
select column_name, is_nullable, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'leads'
  and column_name = 'email';
