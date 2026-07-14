-- Ruchi Realty Media module. Safe to rerun; does not modify project or blog tables.
begin;
create extension if not exists pgcrypto;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('media-images','media-images',true,5242880,array['image/webp']) on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/webp'];
create table if not exists public.media_assets (
 id uuid primary key default gen_random_uuid(), original_url text, original_filename text, file_path text not null,
 public_url text not null, thumbnail_url text, mime_type text, file_size integer, thumbnail_file_size integer,
 width integer, height integer, hash text not null unique, usage_type text not null default 'gallery',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.media_gallery_items (
 id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique, caption text, alt_text text not null,
 image_asset_id uuid not null references public.media_assets(id) on delete restrict, category text not null default 'Other', album text,
 related_project_slug text, display_order integer not null default 0, is_featured boolean not null default false,
 status text not null default 'published', seo_title text, seo_description text, og_image_asset_id uuid references public.media_assets(id),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 constraint media_gallery_category_check check(category in ('Projects','Amenities','Lifestyle','Construction Updates','Events','Awards','Team','Other')),
 constraint media_gallery_status_check check(status in ('draft','published','unpublished'))
);
create table if not exists public.media_press_releases (
 id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique, excerpt text, content text,
 release_date date, source_name text, author text, external_url text, pdf_url text, cover_asset_id uuid references public.media_assets(id),
 status text not null default 'draft', is_featured boolean not null default false, display_order integer not null default 0,
 seo_title text, seo_description text, og_image_asset_id uuid references public.media_assets(id), old_url text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 constraint media_press_status_check check(status in ('draft','published','unpublished'))
);
create table if not exists public.media_events_awards (
 id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique, item_type text not null,
 event_date date, location text, excerpt text, description text, cover_asset_id uuid references public.media_assets(id),
 video_url text, external_url text, related_project_slug text, status text not null default 'draft', is_featured boolean not null default false,
 display_order integer not null default 0, seo_title text, seo_description text, og_image_asset_id uuid references public.media_assets(id), old_url text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 constraint media_event_type_check check(item_type in ('Event','Award','Recognition','Milestone','Media Coverage')),
 constraint media_event_status_check check(status in ('draft','published','unpublished')),
 constraint media_video_url_check check(video_url is null or video_url ~* '^https?://')
);
create table if not exists public.media_event_award_assets (
 id uuid primary key default gen_random_uuid(), event_award_id uuid not null references public.media_events_awards(id) on delete cascade,
 asset_id uuid not null references public.media_assets(id) on delete cascade, display_order integer not null default 0,
 created_at timestamptz not null default now(), unique(event_award_id,asset_id)
);
create table if not exists public.media_page_settings (
 page_key text primary key, title text not null, subtitle text, seo_title text, seo_description text,
 og_image_url text, updated_at timestamptz not null default now()
);
create index if not exists media_gallery_public_idx on public.media_gallery_items(status,display_order,id);
create index if not exists media_press_public_idx on public.media_press_releases(status,release_date desc,display_order);
create index if not exists media_events_public_idx on public.media_events_awards(status,event_date desc,display_order);
create index if not exists media_assets_usage_idx on public.media_assets(usage_type);
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
do $$ declare name text; begin foreach name in array array['media_assets','media_gallery_items','media_press_releases','media_events_awards','media_page_settings'] loop execute format('drop trigger if exists set_%I_updated_at on public.%I',name,name); execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',name,name); end loop; end $$;
insert into public.media_page_settings(page_key,title,subtitle,seo_title,seo_description) values
 ('gallery','Gallery','Projects, events and lifestyle','Gallery | Ruchi Realty Projects, Events & Lifestyle','Explore Ruchi Realty’s gallery featuring project visuals, amenities, construction updates, lifestyle moments, events, awards, and community highlights.'),
 ('press-releases','Press Releases','Official news and announcements','Press Releases | Ruchi Realty News & Media Updates','Stay updated with official press releases, announcements, media updates, and real estate developments from Ruchi Realty.'),
 ('events-awards','Events & Awards','Recognitions and milestone moments','Events & Awards | Ruchi Realty','Explore Ruchi Realty’s events, awards, recognitions, milestones, and media moments.')
on conflict(page_key) do nothing;
alter table public.media_assets enable row level security; alter table public.media_gallery_items enable row level security;
alter table public.media_press_releases enable row level security; alter table public.media_events_awards enable row level security;
alter table public.media_event_award_assets enable row level security; alter table public.media_page_settings enable row level security;
do $$ declare t text; begin foreach t in array array['media_assets','media_gallery_items','media_press_releases','media_events_awards','media_event_award_assets','media_page_settings'] loop execute format('drop policy if exists "Media admin manage" on public.%I',t); execute format('create policy "Media admin manage" on public.%I for all to authenticated using (true) with check (true)',t); end loop; end $$;
drop policy if exists "Public reads media assets" on public.media_assets; create policy "Public reads media assets" on public.media_assets for select to anon using(true);
drop policy if exists "Public reads gallery" on public.media_gallery_items; create policy "Public reads gallery" on public.media_gallery_items for select to anon using(status='published');
drop policy if exists "Public reads press" on public.media_press_releases; create policy "Public reads press" on public.media_press_releases for select to anon using(status='published');
drop policy if exists "Public reads events" on public.media_events_awards; create policy "Public reads events" on public.media_events_awards for select to anon using(status='published');
drop policy if exists "Public reads event assets" on public.media_event_award_assets; create policy "Public reads event assets" on public.media_event_award_assets for select to anon using(true);
drop policy if exists "Public reads media settings" on public.media_page_settings; create policy "Public reads media settings" on public.media_page_settings for select to anon using(true);
commit;
-- Storage policies follow the same authenticated-admin/public-read pattern used by the site.
drop policy if exists "Public reads media images" on storage.objects;
create policy "Public reads media images" on storage.objects for select to public using(bucket_id='media-images');
drop policy if exists "Admins upload media images" on storage.objects;
create policy "Admins upload media images" on storage.objects for insert to authenticated with check(bucket_id='media-images');
drop policy if exists "Admins update media images" on storage.objects;
create policy "Admins update media images" on storage.objects for update to authenticated using(bucket_id='media-images') with check(bucket_id='media-images');
drop policy if exists "Admins delete media images" on storage.objects;
create policy "Admins delete media images" on storage.objects for delete to authenticated using(bucket_id='media-images');
-- Rollback notes: drop the six media_* tables only if the module and its data are intentionally being removed.
