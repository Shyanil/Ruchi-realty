-- Project location and connectivity details.
-- Run once in Supabase Dashboard > SQL Editor.
-- All fields are editable from the Projects > Location tab in the admin panel.

BEGIN;

ALTER TABLE public.project_subpages
  ADD COLUMN IF NOT EXISTS location_image text DEFAULT '',
  ADD COLUMN IF NOT EXISTS location_map_embed text DEFAULT '',
  ADD COLUMN IF NOT EXISTS location_destinations jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS nearby_landmarks jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS schools jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hospitals jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS metro_road_connectivity jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS airport_railway_distances jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS business_hubs jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS shopping_centres jsonb DEFAULT '[]'::jsonb;

-- Repair null or non-array legacy values before applying NOT NULL constraints.
UPDATE public.project_subpages
SET
  location_image = COALESCE(location_image, ''),
  location_map_embed = COALESCE(location_map_embed, ''),
  location_destinations = CASE WHEN jsonb_typeof(location_destinations) = 'array' THEN location_destinations ELSE '[]'::jsonb END,
  nearby_landmarks = CASE WHEN jsonb_typeof(nearby_landmarks) = 'array' THEN nearby_landmarks ELSE '[]'::jsonb END,
  schools = CASE WHEN jsonb_typeof(schools) = 'array' THEN schools ELSE '[]'::jsonb END,
  hospitals = CASE WHEN jsonb_typeof(hospitals) = 'array' THEN hospitals ELSE '[]'::jsonb END,
  metro_road_connectivity = CASE WHEN jsonb_typeof(metro_road_connectivity) = 'array' THEN metro_road_connectivity ELSE '[]'::jsonb END,
  airport_railway_distances = CASE WHEN jsonb_typeof(airport_railway_distances) = 'array' THEN airport_railway_distances ELSE '[]'::jsonb END,
  business_hubs = CASE WHEN jsonb_typeof(business_hubs) = 'array' THEN business_hubs ELSE '[]'::jsonb END,
  shopping_centres = CASE WHEN jsonb_typeof(shopping_centres) = 'array' THEN shopping_centres ELSE '[]'::jsonb END;

-- Preserve existing destination data by treating it as nearby landmarks.
UPDATE public.project_subpages
SET nearby_landmarks = location_destinations
WHERE jsonb_array_length(nearby_landmarks) = 0
  AND jsonb_array_length(location_destinations) > 0;

ALTER TABLE public.project_subpages
  ALTER COLUMN location_image SET DEFAULT '',
  ALTER COLUMN location_image SET NOT NULL,
  ALTER COLUMN location_map_embed SET DEFAULT '',
  ALTER COLUMN location_map_embed SET NOT NULL,
  ALTER COLUMN location_destinations SET DEFAULT '[]'::jsonb,
  ALTER COLUMN location_destinations SET NOT NULL,
  ALTER COLUMN nearby_landmarks SET DEFAULT '[]'::jsonb,
  ALTER COLUMN nearby_landmarks SET NOT NULL,
  ALTER COLUMN schools SET DEFAULT '[]'::jsonb,
  ALTER COLUMN schools SET NOT NULL,
  ALTER COLUMN hospitals SET DEFAULT '[]'::jsonb,
  ALTER COLUMN hospitals SET NOT NULL,
  ALTER COLUMN metro_road_connectivity SET DEFAULT '[]'::jsonb,
  ALTER COLUMN metro_road_connectivity SET NOT NULL,
  ALTER COLUMN airport_railway_distances SET DEFAULT '[]'::jsonb,
  ALTER COLUMN airport_railway_distances SET NOT NULL,
  ALTER COLUMN business_hubs SET DEFAULT '[]'::jsonb,
  ALTER COLUMN business_hubs SET NOT NULL,
  ALTER COLUMN shopping_centres SET DEFAULT '[]'::jsonb,
  ALTER COLUMN shopping_centres SET NOT NULL;

COMMENT ON COLUMN public.project_subpages.location_map_embed IS
  'Google Maps embed URL or full iframe markup; the website extracts and safely renders the iframe src.';
COMMENT ON COLUMN public.project_subpages.location_image IS
  'Static location map image URL used when a Google Maps embed is not provided.';
COMMENT ON COLUMN public.project_subpages.nearby_landmarks IS
  'Nearby landmarks as [{"name":"Landmark","distance":"2 km"}].';
COMMENT ON COLUMN public.project_subpages.schools IS
  'Nearby schools as [{"name":"School","distance":"10 min"}].';
COMMENT ON COLUMN public.project_subpages.hospitals IS
  'Nearby hospitals as [{"name":"Hospital","distance":"4 km"}].';
COMMENT ON COLUMN public.project_subpages.metro_road_connectivity IS
  'Metro stations, roads and junctions as [{"name":"Connection","distance":"3 km"}].';
COMMENT ON COLUMN public.project_subpages.airport_railway_distances IS
  'Airport and railway connections as [{"name":"Station or airport","distance":"25 min"}].';
COMMENT ON COLUMN public.project_subpages.business_hubs IS
  'Business and IT hubs as [{"name":"Business hub","distance":"6 km"}].';
COMMENT ON COLUMN public.project_subpages.shopping_centres IS
  'Malls and shopping centres as [{"name":"Shopping centre","distance":"12 min"}].';

COMMIT;

-- OPTIONAL DIRECT SQL UPDATE EXAMPLE
-- Replace the project title and sample values, then run this UPDATE separately.
--
-- UPDATE public.project_subpages AS subpage
-- SET
--   location_map_embed = 'https://www.google.com/maps/embed?pb=YOUR_EMBED_PARAMETERS',
--   location_image = '',
--   nearby_landmarks = '[{"name":"City landmark","distance":"2 km"}]'::jsonb,
--   schools = '[{"name":"Example School","distance":"10 min"}]'::jsonb,
--   hospitals = '[{"name":"Example Hospital","distance":"4 km"}]'::jsonb,
--   metro_road_connectivity = '[{"name":"Main Road","distance":"1 km"},{"name":"Nearest Metro","distance":"5 km"}]'::jsonb,
--   airport_railway_distances = '[{"name":"Airport","distance":"25 min"},{"name":"Railway Station","distance":"30 min"}]'::jsonb,
--   business_hubs = '[{"name":"Business District","distance":"6 km"}]'::jsonb,
--   shopping_centres = '[{"name":"Shopping Mall","distance":"12 min"}]'::jsonb,
--   updated_at = now()
-- FROM public.projects AS project
-- WHERE subpage.project_id = project.id
--   AND lower(trim(project.title)) = 'one victoria';

-- Verification after migration.
SELECT
  project.title,
  subpage.location_map_embed,
  subpage.location_image,
  jsonb_array_length(subpage.nearby_landmarks) AS landmark_count,
  jsonb_array_length(subpage.schools) AS school_count,
  jsonb_array_length(subpage.hospitals) AS hospital_count,
  jsonb_array_length(subpage.metro_road_connectivity) AS connectivity_count,
  jsonb_array_length(subpage.airport_railway_distances) AS transit_count,
  jsonb_array_length(subpage.business_hubs) AS business_hub_count,
  jsonb_array_length(subpage.shopping_centres) AS shopping_count
FROM public.projects AS project
LEFT JOIN public.project_subpages AS subpage
  ON subpage.project_id = project.id
ORDER BY project.title;
