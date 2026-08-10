-- Oscar Palace: use the official front-elevation WebP in Project Overview.
-- Deploy public/projects/oscar-palace/hero.webp before running this migration.

ALTER TABLE public.project_subpages
  ADD COLUMN IF NOT EXISTS overview_image text DEFAULT '';

COMMENT ON COLUMN public.project_subpages.overview_image IS
  'Optional image displayed beside the Project Overview copy.';

UPDATE public.project_subpages AS subpage
SET overview_image = '/projects/oscar-palace/hero.webp',
    hero_bg = '/projects/oscar-palace/hero.webp',
    og_image = '/projects/oscar-palace/hero.webp'
FROM public.projects AS project
WHERE subpage.project_id = project.id
  AND lower(trim(project.title)) = 'oscar palace';

SELECT project.title, subpage.overview_image, subpage.hero_bg
FROM public.projects AS project
JOIN public.project_subpages AS subpage ON subpage.project_id = project.id
WHERE lower(trim(project.title)) = 'oscar palace';
