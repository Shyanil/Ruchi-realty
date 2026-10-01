-- ============================================================
-- Ruchi Realty: Fix Media Gallery Storage & Database Configuration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Create missing Storage Buckets (allows uploading media & project images)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media-images', 'media-images', true, 5242880, array['image/webp','image/jpeg','image/png','image/gif']),
  ('project-images', 'project-images', true, 5242880, array['image/webp','image/jpeg','image/png','image/gif'])
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/webp','image/jpeg','image/png','image/gif'];

-- 2. Storage Objects Access Policies
drop policy if exists "Public reads media images" on storage.objects;
create policy "Public reads media images" on storage.objects
  for select to public using (bucket_id in ('media-images', 'project-images'));

drop policy if exists "Admins upload media images" on storage.objects;
create policy "Admins upload media images" on storage.objects
  for insert to authenticated with check (bucket_id in ('media-images', 'project-images'));

drop policy if exists "Admins update media images" on storage.objects;
create policy "Admins update media images" on storage.objects
  for update to authenticated using (bucket_id in ('media-images', 'project-images'))
  with check (bucket_id in ('media-images', 'project-images'));

drop policy if exists "Admins delete media images" on storage.objects;
create policy "Admins delete media images" on storage.objects
  for delete to authenticated using (bucket_id in ('media-images', 'project-images'));

-- 3. Schema adjustments for media_gallery_items
-- Allow videos to be created without requiring an uploaded image asset
alter table public.media_gallery_items alter column image_asset_id drop not null;

-- Ensure video_url, media_type, image_url, and thumbnail_url columns exist
alter table public.media_gallery_items add column if not exists video_url text;
alter table public.media_gallery_items add column if not exists media_type text default 'image';
alter table public.media_gallery_items add column if not exists image_url text;
alter table public.media_gallery_items add column if not exists thumbnail_url text;

-- Drop restrictive category check constraint to allow 'Videos', 'Events', 'Office Culture', etc.
alter table public.media_gallery_items drop constraint if exists media_gallery_category_check;

-- 4. Row Level Security Policies for media_gallery_items
alter table public.media_gallery_items enable row level security;

drop policy if exists "Media admin manage" on public.media_gallery_items;
create policy "Media admin manage" on public.media_gallery_items
  for all to authenticated using (true) with check (true);

drop policy if exists "Public reads gallery" on public.media_gallery_items;
create policy "Public reads gallery" on public.media_gallery_items
  for select to anon using (status = 'published');

-- 5. Row Level Security Policies for media_assets
alter table public.media_assets enable row level security;

drop policy if exists "Media assets admin manage" on public.media_assets;
create policy "Media assets admin manage" on public.media_assets
  for all to authenticated using (true) with check (true);

drop policy if exists "Public reads media assets" on public.media_assets;
create policy "Public reads media assets" on public.media_assets
  for select to anon using (true);

-- 6. Normalize legacy .jpg/.jpeg/.png image URLs in media_assets to .webp
update public.media_assets
set
  public_url = regexp_replace(public_url, '\.(jpg|jpeg|png)$', '.webp', 'i'),
  thumbnail_url = regexp_replace(thumbnail_url, '\.(jpg|jpeg|png)$', '.webp', 'i')
where public_url ~* '\.(jpg|jpeg|png)$' or thumbnail_url ~* '\.(jpg|jpeg|png)$';

-- 7. Ensure any existing gallery video items have media_type = 'video'
update public.media_gallery_items
set media_type = 'video'
where video_url is not null and trim(video_url) != '' and (media_type is null or media_type = 'image');
