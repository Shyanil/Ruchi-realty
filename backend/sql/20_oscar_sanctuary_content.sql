-- Oscar Sanctuary: seed the project page with approved WebP renders and editable content.
-- Deploy public/projects/oscar-sanctuary-indore/ before running this in Supabase SQL Editor.
-- The admin panel can edit individual fields/images and can delete the project/subpage afterward.

BEGIN;

-- Keep this migration safe on older project_subpages installations.
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
    'Oscar Sanctuary is a residential project in Indore planned around landscaped open spaces and shared community amenities. The available design visuals present a green neighbourhood shaped by a series of pocket parks, recreation areas and welcoming outdoor spaces.',
    'The current project renders showcase a clubhouse with a swimming pool, outdoor courts, play areas, fitness spaces, garden pavilions and connected green zones. Detailed inventory, plot dimensions, approvals and development timelines can be confirmed directly with Ruchi Realty.'
  );
  highlights jsonb := jsonb_build_array(
    jsonb_build_object('label','Location','desc','Indore','icon','location'),
    jsonb_build_object('label','Project Type','desc','Residential community','icon','infrastructure'),
    jsonb_build_object('label','Status','desc','Ongoing','icon','size'),
    jsonb_build_object('label','Landscape','desc','Pocket parks and community greens','icon','amenities')
  );
  amenity_list jsonb := jsonb_build_array(
    jsonb_build_object('name','Clubhouse','icon','club'),
    jsonb_build_object('name','Swimming Pool','icon','pool'),
    jsonb_build_object('name','Landscaped Pocket Parks','icon','garden'),
    jsonb_build_object('name','Outdoor Sports Courts','icon','tennis'),
    jsonb_build_object('name','Kids Play Areas','icon','playground'),
    jsonb_build_object('name','Outdoor Fitness Spaces','icon','gym'),
    jsonb_build_object('name','Garden Pavilions','icon','hall'),
    jsonb_build_object('name','Walking and Green Zones','icon','jogging')
  );
  custom_specs jsonb := jsonb_build_array(
    jsonb_build_object('title','__hero_mobile_url__','desc','/projects/oscar-sanctuary-indore/hero-mobile-pocket-park.webp'),
    jsonb_build_object('title','__floor_plans__','desc','[]'),
    jsonb_build_object('title','__video_section__','desc','{"enabled":false,"videoUrl":"","thumbnailUrl":""}'),
    jsonb_build_object('title','__gmb_reviews__','desc','{"enabled":false,"reviews":[]}')
  );
  gallery_list jsonb := jsonb_build_array(
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-aerial-view-001.webp','alt','Oscar Sanctuary masterplan artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-club-view-003.webp','alt','Oscar Sanctuary clubhouse swimming pool artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-001-view-002.webp','alt','Oscar Sanctuary open lawn artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-002-view-001.webp','alt','Oscar Sanctuary children''s play lawn artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-004-view-005.webp','alt','Oscar Sanctuary outdoor sports courts artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-005-view-001.webp','alt','Oscar Sanctuary garden pavilion artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-006-view-001-update.webp','alt','Oscar Sanctuary practice court artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-007-view-004.webp','alt','Oscar Sanctuary landscaped pocket park artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-008-view-001.webp','alt','Oscar Sanctuary outdoor fitness area artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-009-view-002.webp','alt','Oscar Sanctuary recreation lawn artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-010-views-003.webp','alt','Oscar Sanctuary landscaped walking garden artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-011-view-004-update.webp','alt','Oscar Sanctuary green walkway artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-015-view-003.webp','alt','Oscar Sanctuary open green space artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-016-view-001.webp','alt','Oscar Sanctuary shaded garden artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-017-view-001-update.webp','alt','Oscar Sanctuary linear park artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-018-view-001.webp','alt','Oscar Sanctuary play area and clubhouse artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-019-view-001.webp','alt','Oscar Sanctuary community lawn artist''s impression','category','Artist''s impression'),
    jsonb_build_object('src','/projects/oscar-sanctuary-indore/gallery-pocket-park-021-and-022-view-001.webp','alt','Oscar Sanctuary children''s garden artist''s impression','category','Artist''s impression')
  );
  faq_list jsonb := jsonb_build_array(
    jsonb_build_object('question','What type of project is Oscar Sanctuary?','answer','Oscar Sanctuary is an ongoing residential community in Indore. Contact Ruchi Realty for the latest inventory, plot configuration and availability details.'),
    jsonb_build_object('question','Which amenities are currently presented for Oscar Sanctuary?','answer','The current project visuals present landscaped pocket parks, a clubhouse and swimming pool, outdoor courts, play areas, fitness spaces, garden pavilions and connected green zones. Final amenities are subject to approved project documentation.'),
    jsonb_build_object('question','How can I check current pricing and availability?','answer','Use the enquiry form on this page to request the latest pricing, available inventory and applicable offers directly from the Oscar Sanctuary sales team.'),
    jsonb_build_object('question','Can I schedule an Oscar Sanctuary site visit?','answer','Yes. Submit an enquiry from this page and the project team can coordinate a suitable date and share the latest available project information.')
  );
BEGIN
  SELECT id
  INTO target_project_id
  FROM public.projects
  WHERE lower(trim(title)) = 'oscar sanctuary'
  LIMIT 1;

  IF target_project_id IS NULL THEN
    RAISE EXCEPTION 'Oscar Sanctuary project was not found in public.projects.';
  END IF;

  UPDATE public.projects
  SET tag = 'A thoughtfully landscaped residential community in Indore',
      image_url = '/projects/oscar-sanctuary-indore/gallery-pocket-park-007-view-004.webp',
      location = 'Indore',
      description = 'Oscar Sanctuary is an ongoing residential community in Indore planned around landscaped pocket parks, recreation areas and shared community amenities.'
  WHERE id = target_project_id;

  IF EXISTS (SELECT 1 FROM public.project_subpages WHERE project_id = target_project_id) THEN
    UPDATE public.project_subpages
    SET hero_title = 'Oscar Sanctuary',
        hero_tagline = 'A thoughtfully landscaped residential community in Indore',
        hero_logo = '',
        hero_bg = '/projects/oscar-sanctuary-indore/gallery-pocket-park-007-view-004.webp',
        hero_mobile_url = '/projects/oscar-sanctuary-indore/hero-mobile-pocket-park.webp',
        hero_image_position = 'center center',
        hero_image_fit = 'cover',
        overview_image = '/projects/oscar-sanctuary-indore/gallery-aerial-view-001.webp',
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
        brochure_url = '',
        rera_number = '',
        faqs = faq_list,
        related_project_slugs = '["oscar-palace","oscar-billionaires","oscar-fort-indore"]'::jsonb,
        cta_labels = '{"brochure":"Request Project Details","visit":"Schedule a Site Visit"}'::jsonb,
        og_image = '/projects/oscar-sanctuary-indore/gallery-pocket-park-007-view-004.webp',
        meta_title = 'Oscar Sanctuary Indore - Ruchi Realty',
        meta_description = 'Explore Oscar Sanctuary, an ongoing residential community in Indore with landscaped pocket parks, clubhouse amenities, outdoor recreation and connected green spaces.',
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
      gen_random_uuid(), target_project_id, 'Oscar Sanctuary',
      'A thoughtfully landscaped residential community in Indore', '',
      '/projects/oscar-sanctuary-indore/gallery-pocket-park-007-view-004.webp',
      '/projects/oscar-sanctuary-indore/hero-mobile-pocket-park.webp',
      'center center', 'cover',
      '/projects/oscar-sanctuary-indore/gallery-aerial-view-001.webp',
      overview_copy, highlights, amenity_list, custom_specs, '', '[]'::jsonb,
      '', '', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
      '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '', '[]'::jsonb, gallery_list,
      '[]'::jsonb, '', '', faq_list,
      '["oscar-palace","oscar-billionaires","oscar-fort-indore"]'::jsonb,
      '{"brochure":"Request Project Details","visit":"Schedule a Site Visit"}'::jsonb,
      '/projects/oscar-sanctuary-indore/gallery-pocket-park-007-view-004.webp',
      'Oscar Sanctuary Indore - Ruchi Realty',
      'Explore Oscar Sanctuary, an ongoing residential community in Indore with landscaped pocket parks, clubhouse amenities, outdoor recreation and connected green spaces.',
      true
    );
  END IF;
END;
$migration$;

COMMIT;

-- Verification: expected counts are 8 amenities, 18 gallery images and 4 FAQs.
SELECT
  project.title,
  subpage.hero_bg,
  subpage.hero_mobile_url,
  jsonb_array_length(subpage.amenities) AS amenity_count,
  jsonb_array_length(subpage.gallery_images) AS gallery_image_count,
  jsonb_array_length(subpage.faqs) AS faq_count,
  subpage.is_published
FROM public.projects AS project
JOIN public.project_subpages AS subpage ON subpage.project_id = project.id
WHERE lower(trim(project.title)) = 'oscar sanctuary';
