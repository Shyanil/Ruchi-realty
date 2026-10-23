-- Run once in Supabase before deploying the admin editor changes.
alter table public.projects add column if not exists slug text;

-- Existing pages retain their established URL where the name-based fallback differs.
update public.projects set slug = case
  when lower(title) like '%one victoria%' and lower(location) like '%kolkata%' then 'one-victoria-new-town'
  when lower(title) like '%one prime%' then 'one-prime-residential'
  when lower(title) like '%active acres%' then 'active-acres-angelica'
  when lower(title) like '%active green%' then 'active-greens'
  when lower(title) like '%active business park%' then 'active-business-park'
  when lower(title) like '%one rajarhat%' then 'one-rajarhat'
  when lower(title) like '%oscar billionaire%' then 'oscar-billionaires'
  when lower(title) like '%oscar pride%' then 'oscar-pride-indore'
  when lower(title) like '%oscar fort%' then 'oscar-fort-indore'
  when lower(title) like '%oscar palace%' then 'oscar-palace'
  when lower(title) like '%oscar sanctuary%' then 'oscar-sanctuary-indore'
  when lower(title) like '%ruchi lifescapes%' and lower(location) like '%bhopal%' then 'lifescapes-bhopal'
  when lower(title) like '%ruchi lifescapes%' and lower(location) like '%indore%' then 'ruchi-lifescapes-indore-project'
  when lower(title) like '%saatvik green%' then 'saatvikgreen-indore'
  when lower(title) like '%saatvik vihar%' then 'saatvik-vihar-indore'
  when lower(title) like '%anand vihar%' then 'anand-vihar-indore'
  when lower(title) like '%ruchi enclave%' then 'ruchi-enclave-indore'
  else trim(both '-' from regexp_replace(lower(title || '-' || location), '[^a-z0-9]+', '-', 'g'))
end
where slug is null or slug = '';

-- Keep the first established URL if multiple legacy rows resolve to the same name.
with duplicates as (
  select id, slug, row_number() over (partition by slug order by created_at, id) as position
  from public.projects
)
update public.projects as project
set slug = duplicates.slug || '-' || replace(project.id::text, '-', '')
from duplicates
where project.id = duplicates.id and duplicates.position > 1;

create unique index if not exists projects_slug_unique on public.projects (slug);
alter table public.projects add constraint projects_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$') not valid;

-- The editor supports draft, published and unpublished articles.
alter table public.blogs drop constraint if exists blogs_status_check;
alter table public.blogs add constraint blogs_status_check
  check (status in ('draft', 'published', 'unpublished')) not valid;
