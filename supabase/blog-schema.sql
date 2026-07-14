-- Safe, additive upgrade for the existing public.blogs and public.blog_comments tables.
begin;

alter table public.blogs add column if not exists updated_at timestamptz not null default timezone('utc', now());
alter table public.blogs add column if not exists status text not null default 'published';
alter table public.blogs add column if not exists image_alt text;
alter table public.blogs add column if not exists seo_title text;
alter table public.blogs add column if not exists seo_description text;
alter table public.blogs add column if not exists canonical_url text;
alter table public.blogs add column if not exists og_title text;
alter table public.blogs add column if not exists og_description text;
alter table public.blogs add column if not exists og_image_url text;
alter table public.blogs add column if not exists reading_time_minutes integer;
alter table public.blogs add column if not exists old_url text;
alter table public.blogs add column if not exists related_project_links text[] not null default '{}';

alter table public.blogs drop constraint if exists blogs_status_check;
alter table public.blogs add constraint blogs_status_check check (status in ('draft','published','unpublished'));
alter table public.blogs drop constraint if exists blogs_image_storage_webp_check;
alter table public.blogs add constraint blogs_image_webp_check check (lower(split_part(image, '?', 1)) like '%.webp');
alter table public.blogs drop constraint if exists blogs_reading_time_check;
alter table public.blogs add constraint blogs_reading_time_check check (reading_time_minutes is null or reading_time_minutes between 1 and 240);
create unique index if not exists blogs_old_url_unique on public.blogs(old_url) where old_url is not null;
create index if not exists blogs_public_idx on public.blogs(status, published_at desc);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = timezone('utc', now()); return new; end $$;
drop trigger if exists set_blogs_updated_at on public.blogs;
create trigger set_blogs_updated_at before update on public.blogs for each row execute function public.set_updated_at();

alter table public.blogs enable row level security;
alter table public.blog_comments enable row level security;
drop policy if exists "Public reads published blogs" on public.blogs;
create policy "Public reads published blogs" on public.blogs for select to anon, authenticated using (status = 'published' and published_at <= now());
drop policy if exists "Admins manage blogs" on public.blogs;
create policy "Admins manage blogs" on public.blogs for all to authenticated using (true) with check (true);
drop policy if exists "Public reads approved comments" on public.blog_comments;
create policy "Public reads approved comments" on public.blog_comments for select to anon, authenticated using (status = 'approved');
drop policy if exists "Public submits pending comments" on public.blog_comments;
create policy "Public submits pending comments" on public.blog_comments for insert to anon, authenticated with check (status = 'pending' and char_length(name) between 2 and 80 and char_length(email) between 5 and 160 and char_length(comment) between 10 and 3000);
drop policy if exists "Admins moderate comments" on public.blog_comments;
create policy "Admins moderate comments" on public.blog_comments for all to authenticated using (true) with check (true);

commit;
