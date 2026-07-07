-- ============================================================
-- SQL Setup & Seeding: "Active Business Park" Project + Subpage
-- 1. Inserts the project row if missing (using correct values)
-- 2. Inserts or updates the subpage content (Single-line JSON values)
-- Run this in your Supabase SQL Editor.
-- ============================================================

DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- 1. Check if the project "Active Business Park" already exists
  SELECT id INTO v_project_id 
  FROM public.projects 
  WHERE title ILIKE '%Active Business Park%' 
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
      'Active Business Park',
      'Ready to Move',
      'assets/projects/active-business-park.webp',
      'Kolkata',
      'Discover Active Business Park: Prime commercial spaces in a strategic location. Modern amenities. Reach new heights for your business!',
      'Commercial',
      'Ready to Move',
      true,
      2,
      2
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
    'Active Business Park',
    'Designed for your business to reach new heights',
    'assets/projects/active-business-park/logo.webp',
    'assets/projects/active-business-park/hero-1.webp',
    '["Active Business Park is designed not only as a commercial space, but as a space for business activities: offices, banks, retail, health, wellness centers, food, IT/ITES, green industries, etc. It is conceived as a workplace for growing corporate and business entrepreneurs in the city.", "Strategic location near 5-star hotels, shopping malls, schools, airport, railway station, and CBDs. Centrally located in Kolkata, 1.2 km off Eastern Metropolitan Bypass, just off the Ma flyover. Connects Park Street, Esplanade, Alipore, Salt Lake Sector 5, Rajarhat, and airport route. Around 5000 premium residences within 2 km radius. Office spaces start from 652 sq ft at Rs 30 lakhs. Spaces can stretch up to 33,000 sq ft on a single floor."]'::jsonb,
    '[{"label": "Commercial Spaces", "desc": "Premium workspaces designed for corporate growth.", "icon": "assets/projects/active-business-park/icon-building.webp"}, {"label": "Ample Amenities", "desc": "Modern infrastructure, backup power and parking.", "icon": "assets/projects/active-business-park/icon-amenities.webp"}, {"label": "Prime Location", "desc": "Centrally located in Kolkata, 1.2 km off E.M. Bypass.", "icon": "assets/projects/active-business-park/icon-location.webp"}, {"label": "Value Package", "desc": "Office spaces starting at competitive pricing.", "icon": "assets/projects/active-business-park/icon-value.webp"}]'::jsonb,
    '[{"name": "24 x 7 Security", "icon": "assets/projects/active-business-park/amenity-security.webp"}, {"name": "Open & Multi-Level Parking", "icon": "assets/projects/active-business-park/amenity-parking.webp"}, {"name": "Intercom Facility", "icon": "assets/projects/active-business-park/amenity-intercom.webp"}, {"name": "CCTV Cameras", "icon": "assets/projects/active-business-park/amenity-cctv.webp"}, {"name": "Water Treatment Plant", "icon": "assets/projects/active-business-park/amenity-water.webp"}, {"name": "Power Back Up Services", "icon": "assets/projects/active-business-park/amenity-generator.webp"}, {"name": "Fire Alarm & Suppression", "icon": "assets/projects/active-business-park/amenity-fire.webp"}, {"name": "Min 3.4m Floor Height", "icon": "assets/projects/active-business-park/amenity-floor-height.webp"}]'::jsonb,
    '[{"title": "Ground Floor", "desc": "assets/projects/active-business-park/floor-ground.webp"}, {"title": "First Floor", "desc": "assets/projects/active-business-park/floor-1st.webp"}, {"title": "Second Floor", "desc": "assets/projects/active-business-park/floor-2nd.webp"}, {"title": "3rd - 6th Floor", "desc": "assets/projects/active-business-park/floor-3rd-6th.webp"}]'::jsonb,
    'assets/projects/active-business-park/location-map.webp',
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7369.203955889171!2d88.390084!3d22.556578!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02768ef7551e65%3A0xd82fba81a29c5969!2sActive%20Business%20Park!5e0!3m2!1sen!2sin!4v1691752959217!5m2!1sen!2sin',
    '[{"name": "E.M. Bypass", "dist": "1.2 km"}, {"name": "Sealdah Station", "dist": "2.5 km"}, {"name": "Salt Lake", "dist": "10 mins"}, {"name": "Park Street", "dist": "10 mins"}, {"name": "Netaji Subhash Chandra Bose Int Airport", "dist": "20 mins"}]'::jsonb,
    '',
    '[{"src": "assets/projects/active-business-park/hero-1.webp", "alt": "Active Business Park - Main Exterior View"}, {"src": "assets/projects/active-business-park/hero-2.webp", "alt": "Active Business Park - Perspective View"}, {"src": "assets/projects/active-business-park/floor-ground.webp", "alt": "Ground Floor Plan"}, {"src": "assets/projects/active-business-park/floor-1st.webp", "alt": "First Floor Plan"}, {"src": "assets/projects/active-business-park/floor-2nd.webp", "alt": "Second Floor Plan"}, {"src": "assets/projects/active-business-park/floor-3rd-6th.webp", "alt": "3rd - 6th Floor Plan"}]'::jsonb,
    'assets/projects/active-business-park/brochure.pdf',
    'Active Business Park - Ruchi Realty',
    'Discover Active Business Park: Prime commercial spaces in a strategic location. Modern amenities. Reach new heights for your business!',
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
