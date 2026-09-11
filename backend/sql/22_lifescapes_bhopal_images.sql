-- Ruchi Lifescapes Bhopal: use the supplied project photographs for the hero and gallery.
-- Deploy public/projects/lifescapes-bhopal/ before running this in Supabase SQL Editor.
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
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-1.webp','alt','Ruchi Lifescapes Bhopal gallery image 1'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-2.webp','alt','Ruchi Lifescapes Bhopal gallery image 2'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-3.webp','alt','Ruchi Lifescapes Bhopal gallery image 3'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-4.webp','alt','Ruchi Lifescapes Bhopal gallery image 4'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-5.webp','alt','Ruchi Lifescapes Bhopal gallery image 5'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-6.webp','alt','Ruchi Lifescapes Bhopal gallery image 6'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/hero-township-landscape.webp','alt','Landscaped central garden at Ruchi Lifescapes Bhopal','category','Project photograph'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-clubhouse.webp','alt','Clubhouse building and landscaped surroundings at Ruchi Lifescapes Bhopal','category','Project photograph'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-apartment-tower.webp','alt','Completed apartment tower at Ruchi Lifescapes Bhopal','category','Project photograph'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-temple.webp','alt','Temple within Ruchi Lifescapes Bhopal','category','Project photograph'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-apartment-courtyard.webp','alt','Landscaped apartment courtyard and play area at Ruchi Lifescapes Bhopal','category','Project photograph'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-playground-courtyard.webp','alt','Children''s playground within the apartment courtyard at Ruchi Lifescapes Bhopal','category','Project photograph'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-row-houses-avenue.webp','alt','Tree-lined row house avenue at Ruchi Lifescapes Bhopal','category','Project photograph'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-row-houses-park.webp','alt','Row houses overlooking a landscaped park at Ruchi Lifescapes Bhopal','category','Project photograph'),
    jsonb_build_object('src','/projects/lifescapes-bhopal/gallery-apartment-playground.webp','alt','Apartment blocks surrounding a children''s play area at Ruchi Lifescapes Bhopal','category','Project photograph')
  );
BEGIN
  SELECT id
  INTO target_project_id
  FROM public.projects
  WHERE lower(trim(title)) = 'ruchi lifescapes bhopal'
     OR (
       lower(trim(title)) = 'ruchi lifescapes'
       AND lower(coalesce(location, '')) LIKE '%bhopal%'
     )
  ORDER BY CASE WHEN lower(trim(title)) = 'ruchi lifescapes bhopal' THEN 0 ELSE 1 END
  LIMIT 1;

  IF target_project_id IS NULL THEN
    RAISE EXCEPTION 'Ruchi Lifescapes Bhopal was not found in public.projects.';
  END IF;

  IF EXISTS (SELECT 1 FROM public.project_subpages WHERE project_id = target_project_id) THEN
    UPDATE public.project_subpages
    SET hero_bg = '/projects/lifescapes-bhopal/hero-township-landscape.webp',
        hero_mobile_url = '/projects/lifescapes-bhopal/hero-mobile-row-houses.webp',
        gallery_images = gallery_list,
        is_published = true,
        updated_at = now()
    WHERE project_id = target_project_id;
  ELSE
    INSERT INTO public.project_subpages (
      id, project_id, hero_title, hero_bg, hero_mobile_url, gallery_images, is_published
    ) VALUES (
      gen_random_uuid(), target_project_id, 'Ruchi Lifescapes',
      '/projects/lifescapes-bhopal/hero-township-landscape.webp',
      '/projects/lifescapes-bhopal/hero-mobile-row-houses.webp',
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
WHERE lower(trim(project.title)) = 'ruchi lifescapes bhopal'
   OR (
     lower(trim(project.title)) = 'ruchi lifescapes'
     AND lower(coalesce(project.location, '')) LIKE '%bhopal%'
   );
