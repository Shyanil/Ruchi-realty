-- ============================================================
-- SQL Setup & Seeding: Active Business Park Editable Sections
-- Run this in your Supabase SQL Editor.
-- Safe to re-run: upserts by project_id.
-- Enables editing of all sections (Overview, Specifications, Amenities,
-- Location, Floor Plans, Gallery, Brochure) directly from Admin panel (/admin).
-- ============================================================

DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- 1. Get or create the "Active Business Park" project row
  SELECT id INTO v_project_id 
  FROM public.projects 
  WHERE title ILIKE '%Active Business Park%' 
  LIMIT 1;

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

  -- 2. Upsert project subpage details
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
    '["Active Business Park is designed not only as a commercial space, but as a space for concoction of business activities: offices, banks, retail, health, wellness centers, food, IT/ITES, green industries, etc. It is conceived as a workplace for growing corporate and business entrepreneurs in the city.", "A strategic location, in the centre of various external economies, i.e., proximity of their business location to 5 star hotels, shopping malls, schools, airport, railway station and CBDs. Centrally located in the city, 1.2 km off Eastern Metropolitan Bypass, just off the “Ma” flyover, the speedway – which links the old CBD - Park Street, Esplanade, Alipore to the IT Hub in Salt Lake Sector 5, Rajarhat extending straight up to the airport. The area as on date has 5000 premium residences within a radius of 2 km.", "Modern day amenities like: passenger and freight lift, CCTV cameras, intercom facility, power back up, water treatment plant, open and multi level car parking, 24 x 7 security, facility management system, clear floor height of 3.4 metres, fire alarm & truck bay for unloading of goods, Hypermarket on the ground floor will meet the daily needs of the neighboring populace.", "Finally, all of the above in a value package: office spaces start from 652 sq ft area at the price of Rs 30 lakhs only. Spaces can stretch up to 33,000 sq ft on a single floor."]'::jsonb,
    '[{"label": "Commercial Spaces", "desc": "Premium workspaces designed for corporate growth.", "icon": "assets/projects/active-business-park/icon-building.webp"}, {"label": "Ample Amenities", "desc": "Modern infrastructure, backup power and parking.", "icon": "assets/projects/active-business-park/icon-amenities.webp"}, {"label": "Prime Location", "desc": "Centrally located in Kolkata, 1.2 km off E.M. Bypass.", "icon": "assets/projects/active-business-park/icon-location.webp"}, {"label": "Value Package", "desc": "Office spaces starting at competitive pricing.", "icon": "assets/projects/active-business-park/icon-value.webp"}]'::jsonb,
    '[{"name": "24 x 7 Security", "icon": "assets/projects/active-business-park/amenity-security.webp"}, {"name": "Open & Multi-Level Parking", "icon": "assets/projects/active-business-park/amenity-parking.webp"}, {"name": "Intercom Facility", "icon": "assets/projects/active-business-park/amenity-intercom.webp"}, {"name": "CCTV Cameras", "icon": "assets/projects/active-business-park/amenity-cctv.webp"}, {"name": "Water Treatment Plant", "icon": "assets/projects/active-business-park/amenity-water.webp"}, {"name": "Power Back Up Services", "icon": "assets/projects/active-business-park/amenity-generator.webp"}, {"name": "Fire Alarm & Suppression", "icon": "assets/projects/active-business-park/amenity-fire.webp"}, {"name": "Min 3.4m Floor Height", "icon": "assets/projects/active-business-park/amenity-floor-height.webp"}]'::jsonb,
    '[{"title": "Commercial & Business Hub", "desc": "Designed for a diverse mix of business activities including offices, banks, retail, health & wellness centers, food, IT/ITES, and green industries. Clear floor height of 3.4 metres with a hypermarket on the ground floor.", "image": "assets/projects/active-business-park/hero-1.webp"}, {"title": "Strategic Connectivity", "desc": "Centrally located 1.2 km off E.M. Bypass, right off the Ma flyover connecting Park Street, Esplanade, Alipore to Salt Lake Sector 5, Rajarhat, and the Airport. Over 5,000 premium residences within a 2 km radius.", "image": "assets/projects/active-business-park/location-map.webp"}, {"title": "Infrastructure & Logistics", "desc": "Modern passenger and freight lifts, 24x7 security with CCTV surveillance, intercom facility, 100% power backup, water treatment plant, facility management system, fire alarm & suppression, and dedicated truck bay for unloading goods.", "image": "assets/projects/active-business-park/hero-2.webp"}, {"title": "Flexible Workspaces & Value Pricing", "desc": "Office spaces starting from 652 sq. ft. area at Rs 30 lakhs only, with single floor plate availability extending up to 33,000 sq. ft.", "image": "assets/projects/active-business-park/hero-1.webp"}, {"title": "__floor_plans__", "desc": "[{\"title\": \"Ground Floor\", \"desc\": \"assets/projects/active-business-park/floor-ground.webp\"}, {\"title\": \"First Floor\", \"desc\": \"assets/projects/active-business-park/floor-1st.webp\"}, {\"title\": \"Second Floor\", \"desc\": \"assets/projects/active-business-park/floor-2nd.webp\"}, {\"title\": \"3rd - 6th Floor\", \"desc\": \"assets/projects/active-business-park/floor-3rd-6th.webp\"}]"}, {"title": "__video_section__", "desc": "{\"enabled\":false,\"title\":\"Construction Walkthrough\",\"videoUrl\":\"\",\"thumbnailUrl\":\"\"}"}]'::jsonb,
    'assets/projects/active-business-park/location-map.webp',
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7369.203955889171!2d88.390084!3d22.556578!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02768ef7551e65%3A0xd82fba81a29c5969!2sActive%20Business%20Park!5e0!3m2!1sen!2sin!4v1691752959217!5m2!1sen!2sin',
    '[{"name": "E.M. Bypass", "dist": "1.2 km"}, {"name": "Sealdah Station", "dist": "2.5 km"}, {"name": "Salt Lake", "dist": "10 mins"}, {"name": "Park Street", "dist": "10 mins"}, {"name": "Netaji Subhash Chandra Bose Int Airport", "dist": "20 mins"}]'::jsonb,
    '',
    '[{"src": "assets/projects/active-business-park/hero-1.webp", "alt": "Active Business Park - Main Exterior View"}, {"src": "assets/projects/active-business-park/hero-2.webp", "alt": "Active Business Park - Perspective View"}]'::jsonb,
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
    is_published = EXCLUDED.is_published,
    updated_at = timezone('utc'::text, now());
END $$;

-- Verification query
SELECT p.title, sp.hero_title, 
       jsonb_array_length(sp.overview_paragraphs) AS overview_paragraphs_count,
       jsonb_array_length(sp.specifications) AS specification_records,
       jsonb_array_length(sp.amenities) AS amenities_count,
       sp.is_published, sp.updated_at
FROM public.project_subpages sp
JOIN public.projects p ON p.id = sp.project_id
WHERE p.title ILIKE '%Active Business Park%';
