-- Run in the Supabase SQL Editor before using the new media ordering controls.
-- Safe to rerun. Existing relative order is retained while duplicate or empty
-- display_order values are changed to consecutive positions. Gallery positions
-- restart at 0 in each category; press and events each have their own sequence.

begin;

alter table public.media_gallery_items
  add column if not exists display_order integer,
  add column if not exists is_featured boolean;
alter table public.media_press_releases
  add column if not exists display_order integer,
  add column if not exists is_featured boolean;
alter table public.media_events_awards
  add column if not exists display_order integer,
  add column if not exists is_featured boolean;

alter table public.media_gallery_items
  alter column display_order set default 0,
  alter column is_featured set default false;
alter table public.media_press_releases
  alter column display_order set default 0,
  alter column is_featured set default false;
alter table public.media_events_awards
  alter column display_order set default 0,
  alter column is_featured set default false;

update public.media_gallery_items set is_featured = false where is_featured is null;
update public.media_press_releases set is_featured = false where is_featured is null;
update public.media_events_awards set is_featured = false where is_featured is null;

with ranked as (
  select id, row_number() over (partition by category order by display_order asc nulls last, created_at asc nulls last, id) - 1 as position
  from public.media_gallery_items
)
update public.media_gallery_items as item
set display_order = ranked.position
from ranked where ranked.id = item.id and item.display_order is distinct from ranked.position;

with ranked as (
  select id, row_number() over (order by display_order asc nulls last, release_date desc nulls last, id) - 1 as position
  from public.media_press_releases
)
update public.media_press_releases as item
set display_order = ranked.position
from ranked where ranked.id = item.id and item.display_order is distinct from ranked.position;

with ranked as (
  select id, row_number() over (order by display_order asc nulls last, event_date desc nulls last, id) - 1 as position
  from public.media_events_awards
)
update public.media_events_awards as item
set display_order = ranked.position
from ranked where ranked.id = item.id and item.display_order is distinct from ranked.position;

create index if not exists media_gallery_status_order_idx
  on public.media_gallery_items (status, display_order);
create index if not exists media_gallery_status_category_order_idx
  on public.media_gallery_items (status, category, display_order);
create index if not exists media_press_status_order_idx
  on public.media_press_releases (status, display_order);
create index if not exists media_events_status_order_idx
  on public.media_events_awards (status, display_order);

commit;
