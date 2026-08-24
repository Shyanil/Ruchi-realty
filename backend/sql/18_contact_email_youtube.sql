-- Update the public contact email and official YouTube profile.
-- Run once in Supabase Dashboard > SQL Editor.
-- Both values remain editable from Admin > Settings afterwards.

BEGIN;

UPDATE public.site_settings
SET
  email = 'emarketing@ruchirealty.com',
  youtube = 'https://www.youtube.com/@ruchirealtygroup',
  updated_at = now()
WHERE id = 1;

-- Replace the retired email inside any project specification copy already
-- stored in Supabase. This preserves the JSON structure and other content.
UPDATE public.project_subpages
SET
  specifications = replace(
    replace(
      specifications::text,
      'emarketing@rrhlrealty.com',
      'emarketing@ruchirealty.com'
    ),
    'info@ruchirealty.com',
    'emarketing@ruchirealty.com'
  )::jsonb,
  updated_at = now()
WHERE specifications::text LIKE '%emarketing@rrhlrealty.com%'
   OR specifications::text LIKE '%info@ruchirealty.com%';

COMMIT;

-- Verification
SELECT id, email, youtube, updated_at
FROM public.site_settings
WHERE id = 1;
