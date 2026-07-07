-- ============================================================
-- SQL Setup & Seeding: "Oscar Billionaires" Project + Subpage
-- 1. Drops the storage restriction constraint on public.projects
-- 2. Inserts the project row if missing (using correct values)
-- 3. Inserts or updates the subpage content (Single-line JSON values)
-- Run this in your Supabase SQL Editor.
-- ============================================================

-- Drop the webp storage path check constraint to allow local codebase paths
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_image_url_storage_webp_check;

DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- 1. Check if the project "Oscar Billionaires" already exists
  SELECT id INTO v_project_id 
  FROM public.projects 
  WHERE title ILIKE '%Oscar Billionaires%' 
  LIMIT 1;

  -- 2. If it doesn't exist, create it
  IF v_project_id IS NULL THEN
    INSERT INTO public.projects (
      id,
      title,
      tag,
      image_url,
      location,
      description,
      type,
      status,
      featured,
      sort_order,
      feature_order
    )
    VALUES (
      gen_random_uuid(),
      'Oscar Billionaires',
      'Ready to Move',
      'assets/projects/oscar-billionaires.webp',
      'Indore',
      'Premium plotted development in Indore Bypass.',
      'Township',
      'Ready to Move',
      true,
      1,
      1
    )
    RETURNING id INTO v_project_id;
  END IF;

  -- 3. Insert or update the project subpage mapping
  INSERT INTO public.project_subpages (
    project_id, 
    hero_title, 
    hero_tagline, 
    hero_logo, 
    hero_bg,
    overview_paragraphs, 
    overview_highlights,
    amenities, 
    specifications,
    location_image, 
    location_map_embed, 
    location_destinations,
    walkthrough_video_id, 
    gallery_images,
    brochure_url, 
    meta_title, 
    meta_description,
    is_published
  )
  VALUES (
    v_project_id,
    'Oscar / Oscar Billionaires',
    'A Smart Upgrade To Premium Living',
    'assets/projects/oscar/logo.webp',
    'assets/projects/oscar/hero.webp',
    '["A Plotted development project, Oscar presents us with the first opportunity to share our definition of what a residential enclave should truly embody. A unique presentation of empirical lifestyle experience, architecturally the concept for the project reflects the traditional heritage living coupled with design influences that are current and appeals to the taste of modern generation.", "Conveniently located on the Indore ByPass it is for the city-dwellers looking for quietude. The project&rsquo;s relative sparsity, ample open spaces and oneness with nature are a huge draw for a quick retreat. Here, peace and privacy are as much a function of design as demand."]'::jsonb,
    '[{"label": "Prime Location", "desc": "Located on Indore Bypass, connected to the city''s best addresses."}, {"label": "Ample Amenities", "desc": "Club house, tennis court, gazebos, jogging tracks and more."}, {"label": "Urban Infrastructure", "desc": "Storm water mgmt, roadway engineering & electrification."}, {"label": "4,000-12,500 SQ. FT.", "desc": "Generous plot sizes crafted for premium living."}]'::jsonb,
    '[{"name": "Swimming Pool", "icon": "pool"}, {"name": "Gymnasium", "icon": "gym"}, {"name": "Multi-purpose Hall", "icon": "hall"}, {"name": "Badminton Court", "icon": "badminton"}, {"name": "Tennis Court", "icon": "tennis"}]'::jsonb,
    '[{"title": "Storm Water, Drainage & Waste Water Management", "desc": "Scientific storm water drainage network with efficient waste water management systems ensuring a clean and safe environment throughout the development."}, {"title": "Roadway Engineering", "desc": "Wide, well-planned internal roads with proper gradients, sub-base preparation, and quality pavement designed for lasting durability."}, {"title": "Communication Network", "desc": "Underground ducting for telephone, internet, and cable TV lines, keeping the landscape clean and future-ready."}, {"title": "Electrification", "desc": "Underground power distribution with adequate street lighting, individual metering, and dedicated feeder pillars."}]'::jsonb,
    'assets/projects/oscar/location.webp',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58871.16254808635!2d75.81428517089842!3d22.7295231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcbaf1440857%3A0xab5e3a8f6c4c5d5e!2sIndore%2C+Madhya+Pradesh!5e0!3m2!1sen!2sin!4v1',
    '[{"name": "Om Mangalam Restaurant", "dist": "1 km"}, {"name": "Vidyasagar School", "dist": "5 km"}, {"name": "Akash Hospital", "dist": "5 km"}, {"name": "Indore Railway Station", "dist": "5 km"}, {"name": "TI Mall", "dist": "6.5 km"}, {"name": "Devi Ahilyabai Holkar Airport", "dist": "16.5 km"}]'::jsonb,
    'HDft2VxWI9k',
    '[{"src": "assets/projects/oscar/tennis-court.webp", "alt": "Tennis Court at Oscar Indore"}, {"src": "assets/projects/oscar/boundary-wall.webp", "alt": "11 Feet Boundary Wall at Oscar Indore"}, {"src": "assets/projects/oscar/accupressure-track.webp", "alt": "Accupressure Track at Oscar Indore"}, {"src": "assets/projects/oscar/central-gazebo.webp", "alt": "Central Gazebo at Oscar Indore"}, {"src": "assets/projects/oscar/garden-gazebo.webp", "alt": "Garden Gazebo at Oscar Indore"}, {"src": "assets/projects/oscar/roundabout.webp", "alt": "Roundabout at Oscar Indore"}, {"src": "assets/projects/oscar/street-view.webp", "alt": "Street View of Oscar Indore"}, {"src": "assets/projects/oscar/temple.webp", "alt": "Temple at Oscar Indore"}]'::jsonb,
    'assets/projects/oscar/brochure.pdf',
    'Oscar / Oscar Billionaires — Premium Plotted Development in Indore | Ruchi Realty',
    'Explore Oscar / Oscar Billionaires in Indore — a premium plotted development with prime location, world-class amenities, and plots from 4,000-12,500 sq. ft.',
    true
  )
  ON CONFLICT (project_id) DO UPDATE SET
    hero_title = EXCLUDED.hero_title,
    hero_tagline = EXCLUDED.hero_tagline,
    hero_logo = EXCLUDED.hero_logo,
    hero_bg = EXCLUDED.hero_bg,
    overview_paragraphs = EXCLUDED.overview_paragraphs,
    overview_highlights = EXCLUDED.overview_highlights,
    amenities = EXCLUDED.amenities,
    specifications = EXCLUDED.specifications,
    location_image = EXCLUDED.location_image,
    location_map_embed = EXCLUDED.location_map_embed,
    location_destinations = EXCLUDED.location_destinations,
    walkthrough_video_id = EXCLUDED.walkthrough_video_id,
    gallery_images = EXCLUDED.gallery_images,
    brochure_url = EXCLUDED.brochure_url,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    is_published = EXCLUDED.is_published;
END $$;
