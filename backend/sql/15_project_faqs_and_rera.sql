-- Project-detail FAQs and a dedicated RERA registration field.
-- Run once in Supabase Dashboard > SQL Editor.

BEGIN;

ALTER TABLE public.project_subpages
  ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS rera_number text DEFAULT '';

UPDATE public.project_subpages
SET faqs = '[]'::jsonb
WHERE faqs IS NULL
   OR jsonb_typeof(faqs) <> 'array';

UPDATE public.project_subpages
SET rera_number = ''
WHERE rera_number IS NULL;

ALTER TABLE public.project_subpages
  ALTER COLUMN faqs SET DEFAULT '[]'::jsonb,
  ALTER COLUMN faqs SET NOT NULL,
  ALTER COLUMN rera_number SET DEFAULT '',
  ALTER COLUMN rera_number SET NOT NULL;

COMMENT ON COLUMN public.project_subpages.faqs IS
  'Admin-editable project-specific FAQs stored as [{"question":"...","answer":"..."}].';

COMMENT ON COLUMN public.project_subpages.rera_number IS
  'Admin-editable RERA or HIRA registration number displayed on the project detail page.';

-- Preserve admin-entered values while backfilling registrations already
-- published in the current project content.
UPDATE public.project_subpages AS subpage
SET rera_number = known.rera_number
FROM public.projects AS project
JOIN (VALUES
  ('one victoria', 'WBRERA/P/NOR/2024/001080'),
  ('active acres', 'HIRA/P/KOL/2020/000778'),
  ('active acres angelica', 'HIRA/P/KOL/2020/000778'),
  ('active business park', 'HIRA/A/NOR/2018/000035'),
  ('oscar fort', 'P-IND-22-3414')
) AS known(project_title, rera_number)
  ON lower(trim(project.title)) = known.project_title
WHERE subpage.project_id = project.id
  AND trim(subpage.rera_number) = '';

COMMIT;

-- Verification: inspect the values available to the website and admin panel.
SELECT
  project.title,
  subpage.rera_number,
  jsonb_array_length(subpage.faqs) AS faq_count
FROM public.projects AS project
LEFT JOIN public.project_subpages AS subpage
  ON subpage.project_id = project.id
ORDER BY project.title;
