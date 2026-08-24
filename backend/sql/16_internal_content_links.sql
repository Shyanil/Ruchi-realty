-- Run this once in the Supabase SQL Editor.
-- Adds editable internal links to blogs, gallery media, press/news, and events/awards.

begin;

alter table public.blogs
  add column if not exists internal_links jsonb not null default '[]'::jsonb;
alter table public.media_gallery_items
  add column if not exists internal_links jsonb not null default '[]'::jsonb;
alter table public.media_press_releases
  add column if not exists internal_links jsonb not null default '[]'::jsonb;
alter table public.media_events_awards
  add column if not exists internal_links jsonb not null default '[]'::jsonb;

comment on column public.blogs.internal_links is
  'Internal SEO links as a JSON array of objects with label and url keys.';
comment on column public.media_gallery_items.internal_links is
  'Internal SEO links as a JSON array of objects with label and url keys.';
comment on column public.media_press_releases.internal_links is
  'Internal SEO links as a JSON array of objects with label and url keys.';
comment on column public.media_events_awards.internal_links is
  'Internal SEO links as a JSON array of objects with label and url keys.';

-- Seed the requested links only when this article has no saved links.
update public.blogs
set internal_links = jsonb_build_array(
  jsonb_build_object('label', 'One Victoria', 'url', '/projects/one-victoria-new-town'),
  jsonb_build_object('label', 'Active Acres', 'url', '/projects/active-acres-angelica'),
  jsonb_build_object('label', 'One Rajarhat', 'url', '/projects/one-rajarhat'),
  jsonb_build_object('label', 'One Prime Residential', 'url', '/projects/one-prime-residential'),
  jsonb_build_object('label', 'Angelica', 'url', '/projects/active-acres-angelica#project-details')
)
where lower(title) like '%top 5%residential%projects%kolkata%'
  and internal_links = '[]'::jsonb;

commit;

select 'blogs' as content_type, count(*) as records_with_internal_links
from public.blogs where jsonb_array_length(internal_links) > 0
union all
select 'gallery', count(*) from public.media_gallery_items where jsonb_array_length(internal_links) > 0
union all
select 'press/news', count(*) from public.media_press_releases where jsonb_array_length(internal_links) > 0
union all
select 'events/awards', count(*) from public.media_events_awards where jsonb_array_length(internal_links) > 0;
