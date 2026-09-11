-- Ruchi Enclave: seed verified project details, supplied WebP images and brochure.
-- Deploy public/projects/ruchi-enclave-indore/ before running this in Supabase SQL Editor.
-- Compatible with older public.projects tables that do not have a slug column.

BEGIN;

ALTER TABLE public.project_subpages
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS hero_title text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_tagline text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_logo text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_bg text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_mobile_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_image_position text DEFAULT 'center center',
  ADD COLUMN IF NOT EXISTS hero_image_fit text DEFAULT 'cover',
  ADD COLUMN IF NOT EXISTS overview_image text DEFAULT '',
  ADD COLUMN IF NOT EXISTS overview_paragraphs jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS overview_highlights jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS amenities jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS specification_image text DEFAULT '',
  ADD COLUMN IF NOT EXISTS floor_plans jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS location_image text DEFAULT '',
  ADD COLUMN IF NOT EXISTS location_map_embed text DEFAULT '',
  ADD COLUMN IF NOT EXISTS location_destinations jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS nearby_landmarks jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS schools jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hospitals jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS metro_road_connectivity jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS airport_railway_distances jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS business_hubs jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS shopping_centres jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS walkthrough_video_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS videos jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS construction_updates jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS brochure_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS rera_number text DEFAULT '',
  ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS related_project_slugs jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cta_labels jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS og_image text DEFAULT '',
  ADD COLUMN IF NOT EXISTS meta_title text DEFAULT '',
  ADD COLUMN IF NOT EXISTS meta_description text DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;

DO $migration$
DECLARE
  target_project_id uuid;
  overview_copy jsonb := jsonb_build_array(
    'Ruchi Enclave is a completed residential plotting project on Jhalariya Road, near Bypass Road, Indore. Conceived as a luxury plotted township, it offers a ready-to-move community setting for buyers looking to build a home in an established development.',
    'The available project visuals highlight a formal entrance and a landscaped community garden with open lawns, walking paths, outdoor fitness equipment, shaded seating and a garden pavilion. Contact Ruchi Realty for current resale availability, plot details and approved project documentation.'
  );
  highlights jsonb := jsonb_build_array(
    jsonb_build_object('label','Status','desc','Completed / Ready to Move','icon','infrastructure'),
    jsonb_build_object('label','Location','desc','Jhalariya Road, near Bypass Road, Indore','icon','location'),
    jsonb_build_object('label','Property Type','desc','Residential plots','icon','size'),
    jsonb_build_object('label','Development','desc','Luxury plotted township','icon','amenities')
  );
  amenity_list jsonb := jsonb_build_array(
    jsonb_build_object('name','Landscaped Community Garden','icon','garden'),
    jsonb_build_object('name','Outdoor Fitness Area','icon','gym'),
    jsonb_build_object('name','Garden Pavilion','icon','hall'),
    jsonb_build_object('name','Walking Paths','icon','jogging'),
    jsonb_build_object('name','Open Lawns','icon','garden'),
    jsonb_build_object('name','Water Features','icon','pool')
  );
  custom_specs jsonb := jsonb_build_array(
    jsonb_build_object('title','__hero_mobile_url__','desc','/projects/ruchi-enclave-indore/hero-mobile-garden-pavilion.webp'),
    jsonb_build_object('title','__floor_plans__','desc','[]'),
    jsonb_build_object('title','__video_section__','desc','{"enabled":false,"videoUrl":"","thumbnailUrl":""}'),
    jsonb_build_object('title','__gmb_reviews__','desc','{"enabled":false,"reviews":[]}')
  );
  gallery_list jsonb := jsonb_build_array(
    jsonb_build_object('src','/projects/ruchi-enclave-indore/hero-entry-gate.webp','alt','Ruchi Enclave entrance gate artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/ruchi-enclave-indore/gallery-pocket-park-aerial.webp','alt','Ruchi Enclave landscaped community garden artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/ruchi-enclave-indore/gallery-garden-pavilion.webp','alt','Ruchi Enclave garden pavilion artist''s impression','category','Artist''s impression')
  );
  faq_list jsonb := jsonb_build_array(
    jsonb_build_object('question','What type of project is Ruchi Enclave?','answer','Ruchi Enclave is a completed residential plotting project and luxury plotted township in Indore.'),
    jsonb_build_object('question','Where is Ruchi Enclave located?','answer','Ruchi Enclave is located on Jhalariya Road, near Bypass Road, Indore.'),
    jsonb_build_object('question','Is Ruchi Enclave ready to move?','answer','Ruchi Realty lists Ruchi Enclave among its completed and ready-to-move projects. Contact the sales team to confirm current plot or resale availability.'),
    jsonb_build_object('question','How can I get the brochure or schedule a visit?','answer','Use the brochure and enquiry options on this page to review the available project material and request a site visit from the Ruchi Realty team.')
  );
BEGIN
  SELECT id
  INTO target_project_id
  FROM public.projects
  WHERE lower(trim(title)) = 'ruchi enclave'
  LIMIT 1;

  IF target_project_id IS NULL THEN
    RAISE EXCEPTION 'Ruchi Enclave project was not found in public.projects.';
  END IF;

  UPDATE public.projects
  SET tag = 'Completed luxury plotted township',
      image_url = '/projects/ruchi-enclave-indore/hero-entry-gate.webp',
      location = 'Jhalariya Road, near Bypass Road, Indore',
      description = 'Ruchi Enclave is a completed ready-to-move residential plotting project on Jhalariya Road, near Bypass Road, Indore.',
      type = 'Residential',
      status = 'Ready to Move'
  WHERE id = target_project_id;

  IF EXISTS (SELECT 1 FROM public.project_subpages WHERE project_id = target_project_id) THEN
    UPDATE public.project_subpages
    SET hero_title = 'Ruchi Enclave',
        hero_tagline = 'A completed luxury plotted township in Indore',
        hero_logo = '',
        hero_bg = '/projects/ruchi-enclave-indore/hero-entry-gate.webp',
        hero_mobile_url = '/projects/ruchi-enclave-indore/hero-mobile-garden-pavilion.webp',
        hero_image_position = 'center center',
        hero_image_fit = 'cover',
        overview_image = '/projects/ruchi-enclave-indore/gallery-pocket-park-aerial.webp',
        overview_paragraphs = overview_copy,
        overview_highlights = highlights,
        amenities = amenity_list,
        specifications = custom_specs,
        specification_image = '',
        floor_plans = '[]'::jsonb,
        location_image = '',
        location_map_embed = '',
        location_destinations = '[]'::jsonb,
        nearby_landmarks = '[]'::jsonb,
        schools = '[]'::jsonb,
        hospitals = '[]'::jsonb,
        metro_road_connectivity = '[]'::jsonb,
        airport_railway_distances = '[]'::jsonb,
        business_hubs = '[]'::jsonb,
        shopping_centres = '[]'::jsonb,
        walkthrough_video_id = '',
        videos = '[]'::jsonb,
        gallery_images = gallery_list,
        construction_updates = '[]'::jsonb,
        brochure_url = 'https://ruchirealty.com/wp-content/uploads/2026/03/Ruchi-Enclave-Indore.pdf',
        rera_number = '',
        faqs = faq_list,
        related_project_slugs = '["ruchi-lifescapes-indore-project","anand-vihar-indore","saatvik-vihar-indore"]'::jsonb,
        cta_labels = '{"brochure":"Download Brochure","visit":"Schedule a Site Visit"}'::jsonb,
        og_image = '/projects/ruchi-enclave-indore/hero-entry-gate.webp',
        meta_title = 'Ruchi Enclave Indore - Ready-to-Move Residential Plots',
        meta_description = 'Explore Ruchi Enclave, a completed ready-to-move luxury plotted township on Jhalariya Road near Bypass Road, Indore, with landscaped community spaces.',
        is_published = true,
        updated_at = now()
    WHERE project_id = target_project_id;
  ELSE
    INSERT INTO public.project_subpages (
      id, project_id, hero_title, hero_tagline, hero_logo, hero_bg, hero_mobile_url,
      hero_image_position, hero_image_fit, overview_image, overview_paragraphs,
      overview_highlights, amenities, specifications, specification_image, floor_plans,
      location_image, location_map_embed, location_destinations, nearby_landmarks,
      schools, hospitals, metro_road_connectivity, airport_railway_distances,
      business_hubs, shopping_centres, walkthrough_video_id, videos, gallery_images,
      construction_updates, brochure_url, rera_number, faqs, related_project_slugs,
      cta_labels, og_image, meta_title, meta_description, is_published
    ) VALUES (
      gen_random_uuid(), target_project_id, 'Ruchi Enclave',
      'A completed luxury plotted township in Indore', '',
      '/projects/ruchi-enclave-indore/hero-entry-gate.webp',
      '/projects/ruchi-enclave-indore/hero-mobile-garden-pavilion.webp',
      'center center', 'cover',
      '/projects/ruchi-enclave-indore/gallery-pocket-park-aerial.webp',
      overview_copy, highlights, amenity_list, custom_specs, '', '[]'::jsonb,
      '', '', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
      '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '', '[]'::jsonb, gallery_list,
      '[]'::jsonb, 'https://ruchirealty.com/wp-content/uploads/2026/03/Ruchi-Enclave-Indore.pdf', '', faq_list,
      '["ruchi-lifescapes-indore-project","anand-vihar-indore","saatvik-vihar-indore"]'::jsonb,
      '{"brochure":"Download Brochure","visit":"Schedule a Site Visit"}'::jsonb,
      '/projects/ruchi-enclave-indore/hero-entry-gate.webp',
      'Ruchi Enclave Indore - Ready-to-Move Residential Plots',
      'Explore Ruchi Enclave, a completed ready-to-move luxury plotted township on Jhalariya Road near Bypass Road, Indore, with landscaped community spaces.',
      true
    );
  END IF;
END;
$migration$;

COMMIT;

-- Verification: expected counts are 6 amenities, 3 gallery images and 4 FAQs.
SELECT
  project.title,
  project.status,
  project.location,
  subpage.hero_bg,
  subpage.hero_mobile_url,
  subpage.brochure_url,
  jsonb_array_length(subpage.amenities) AS amenity_count,
  jsonb_array_length(subpage.gallery_images) AS gallery_image_count,
  jsonb_array_length(subpage.faqs) AS faq_count,
  subpage.is_published
FROM public.projects AS project
JOIN public.project_subpages AS subpage ON subpage.project_id = project.id
WHERE lower(trim(project.title)) = 'ruchi enclave';
