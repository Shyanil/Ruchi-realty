-- ============================================================
-- Project Subpages — editable content for project detail pages
-- Each project gets ONE subpage row (1:1 with projects)
-- ============================================================

create table public.project_subpages (
  id uuid not null default gen_random_uuid(),
  project_id uuid not null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),

  -- Hero section
  hero_title text,
  hero_tagline text,
  hero_logo text,
  hero_bg text,

  -- Overview section (paragraphs stored as JSON array of strings)
  overview_paragraphs jsonb not null default '[]'::jsonb,
  overview_highlights jsonb not null default '[]'::jsonb,

  -- Amenities (JSON array of {name, icon})
  amenities jsonb not null default '[]'::jsonb,

  -- Specifications (JSON array of {title, desc})
  specifications jsonb not null default '[]'::jsonb,

  -- Location section
  location_image text,
  location_map_embed text,
  location_destinations jsonb not null default '[]'::jsonb,

  -- Walkthrough section
  walkthrough_video_id text,

  -- Gallery (JSON array of {src, alt})
  gallery_images jsonb not null default '[]'::jsonb,

  -- Brochure
  brochure_url text,

  -- SEO
  meta_title text,
  meta_description text,

  -- Publishing
  is_published boolean not null default false,

  -- Constraints
  constraint project_subpages_pkey primary key (id),
  constraint project_subpages_project_id_fkey foreign key (project_id)
    references public.projects (id) on delete cascade,
  constraint project_subpages_project_id_unique unique (project_id)
);

-- Index for fast lookup by project
create index if not exists idx_project_subpages_project_id
  on public.project_subpages using btree (project_id) tablespace pg_default;

-- Auto-update updated_at
create trigger set_project_subpages_updated_at
  before update on public.project_subpages
  for each row execute function set_updated_at();

-- ============================================================
-- RLS: admins can CRUD, anon/public can SELECT published
-- ============================================================

alter table public.project_subpages enable row level security;

-- Anyone can view published subpages
create policy "Anyone can view published project subpages"
  on public.project_subpages for select
  using (is_published = true);

-- Authenticated users (admins) can view all
create policy "Admins can view all project subpages"
  on public.project_subpages for select
  to authenticated
  using (true);

-- Only admins can insert
create policy "Admins can insert project subpages"
  on public.project_subpages for insert
  to authenticated
  with check (true);

-- Only admins can update
create policy "Admins can update project subpages"
  on public.project_subpages for update
  to authenticated
  using (true);

-- Only admins can delete
create policy "Admins can delete project subpages"
  on public.project_subpages for delete
  to authenticated
  using (true);
