-- Saatvik Green Indore: use the supplied project photographs for the hero and gallery.
-- Deploy public/projects/saatvikgreen-indore/ before running this in Supabase SQL Editor.
-- Compatible with older public.projects tables that do not have a slug column.

BEGIN;

ALTER TABLE public.project_subpages
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS hero_title text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_bg text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_mobile_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;

DO $migration$
DECLARE
  target_project_id uuid;
  gallery_list jsonb := jsonb_build_array(
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-1.webp','alt','Saatvik Green Indore gallery image 1'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-2.webp','alt','Saatvik Green Indore gallery image 2'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-3.webp','alt','Saatvik Green Indore gallery image 3'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-4.webp','alt','Saatvik Green Indore gallery image 4'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-5.webp','alt','Saatvik Green Indore gallery image 5'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-6.webp','alt','Saatvik Green Indore gallery image 6'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-7.webp','alt','Saatvik Green Indore gallery image 7'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-8.webp','alt','Saatvik Green Indore gallery image 8'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-9.webp','alt','Saatvik Green Indore gallery image 9'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-10.webp','alt','Saatvik Green Indore gallery image 10'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-11.webp','alt','Saatvik Green Indore gallery image 11'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/hero-entrance-gate.webp','alt','Completed entrance gate at Saatvik Green Indore','category','Project photograph'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-sports-turf-wide.webp','alt','Outdoor sports turf at Saatvik Green Indore','category','Project photograph'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-sports-turf.webp','alt','Full view of the outdoor sports turf at Saatvik Green Indore','category','Project photograph'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-childrens-play-area.webp','alt','Children''s play area at Saatvik Green Indore','category','Project photograph'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-landscaped-playground.webp','alt','Landscaped playground and garden at Saatvik Green Indore','category','Project photograph'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-outdoor-chess-garden.webp','alt','Outdoor chess area in the landscaped garden at Saatvik Green Indore','category','Project photograph'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-community-garden.webp','alt','Community garden and children''s play zone at Saatvik Green Indore','category','Project photograph'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-entrance-driveway.webp','alt','Landscaped entrance driveway at Saatvik Green Indore','category','Project photograph'),
    jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-entrance-landscaping.webp','alt','Palm-lined entrance landscaping at Saatvik Green Indore','category','Project photograph')
  );
BEGIN
  SELECT id
  INTO target_project_id
  FROM public.projects
  WHERE lower(trim(title)) = 'saatvik green'
  LIMIT 1;

  IF target_project_id IS NULL THEN
    RAISE EXCEPTION 'Saatvik Green was not found in public.projects.';
  END IF;

  IF EXISTS (SELECT 1 FROM public.project_subpages WHERE project_id = target_project_id) THEN
    UPDATE public.project_subpages
    SET hero_bg = '/projects/saatvikgreen-indore/hero-entrance-gate.webp',
        hero_mobile_url = '/projects/saatvikgreen-indore/hero-mobile-entrance-gate.webp',
        gallery_images = gallery_list,
        is_published = true,
        updated_at = now()
    WHERE project_id = target_project_id;
  ELSE
    INSERT INTO public.project_subpages (
      id, project_id, hero_title, hero_bg, hero_mobile_url, gallery_images, is_published
    ) VALUES (
      gen_random_uuid(), target_project_id, 'Saatvik Green',
      '/projects/saatvikgreen-indore/hero-entrance-gate.webp',
      '/projects/saatvikgreen-indore/hero-mobile-entrance-gate.webp',
      gallery_list, true
    );
  END IF;
END;
$migration$;

COMMIT;

SELECT
  project.title,
  project.location,
  subpage.hero_bg,
  subpage.hero_mobile_url,
  jsonb_array_length(subpage.gallery_images) AS gallery_image_count,
  subpage.is_published
FROM public.projects AS project
JOIN public.project_subpages AS subpage ON subpage.project_id = project.id
WHERE lower(trim(project.title)) = 'saatvik green';
