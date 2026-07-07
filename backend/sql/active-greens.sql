-- ============================================================
-- SQL Setup & Seeding: "Active Greens" Project + Subpage
-- 1. Inserts the project row if missing (using correct values)
-- 2. Inserts or updates the subpage content (using local code paths)
-- Run this in your Supabase SQL Editor.
-- ============================================================

DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- 1. Check if the project "Active Greens" already exists
  SELECT id INTO v_project_id 
  FROM public.projects 
  WHERE title ILIKE '%Active Green%' 
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
      'Active Greens',
      'Ready to Move',
      '/projects/active-greens/thumbnail.webp',
      'Off E.M. Bypass, Kolkata',
      'Having set it’s footprints in Kolkata, Ruchi Realty comes up with its second project Active Greens full with green environment. Located off E.M. Bypass it offers approximately 100 units ranging from 1065-1555 sq. ft. area in the two spectacular residential towers. We have worked to achieve the nearest semblance to your dream home. Its blue pool and green gardens will make your spirit feel liberated.',
      'Residential',
      'Ready to Move',
      true,
      8,
      8
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
    'Active Greens',
    'In the heart of the city, away from the concrete jungle',
    '/projects/active-greens/logo.webp',
    '/projects/active-greens/thumbnail.webp',
    
    $json$[
      "Having set it’s footprints in Kolkata, Ruchi Realty comes up with its second project Active Greens full with green environment. Located off E.M. Bypass it offers approximately 100 units ranging from 1065-1555 sq. ft. area in the two spectacular residential towers.",
      "We have worked to achieve the nearest semblance to your dream home. The focus has been to provide you with lifestyle amenities so that the whole living space resonate the vigor of liveliness. Its blue pool and green gardens will make your spirit feel liberated. Active Greens is not just a home, it is freedom from the concrete jungle, right in the heart of the city."
    ]$json$::jsonb,
    
    $json$[
      {"label": "2 Residential Towers", "desc": "Two spectacular residential structures.", "icon": "assets/projects/oscar/icon-infrastructure.webp"},
      {"label": "100 Units", "desc": "Premium units from 1065-1555 sq. ft.", "icon": "assets/projects/oscar/icon-size.webp"},
      {"label": "Prime Location", "desc": "Located off E.M. Bypass, Kolkata.", "icon": "assets/projects/oscar/icon-location.webp"},
      {"label": "Ample Amenities", "desc": "Swimming pool, gym & landscaped gardens.", "icon": "assets/projects/oscar/icon-amenities.webp"}
    ]$json$::jsonb,
    
    $json$[
      {"name": "Children Playground", "icon": "playground"},
      {"name": "Swimming Pool", "icon": "pool"},
      {"name": "Gymnasium", "icon": "gym"},
      {"name": "Community Hall", "icon": "hall"},
      {"name": "Library", "icon": "library"},
      {"name": "TV Lounge", "icon": "lounge"},
      {"name": "Landscape Garden", "icon": "garden"},
      {"name": "Water Supply", "icon": "water"},
      {"name": "Indoor Games", "icon": "games"},
      {"name": "Security", "icon": "security"},
      {"name": "Pool Table", "icon": "snooker"},
      {"name": "Elevator", "icon": "elevator"},
      {"name": "Lobby", "icon": "lobby"},
      {"name": "Fire Alarm", "icon": "fire"},
      {"name": "Internal Road", "icon": "road"},
      {"name": "Facility Management", "icon": "management"},
      {"name": "Generator Backup", "icon": "generator"},
      {"name": "Intercom", "icon": "intercom"},
      {"name": "CCTV Camera", "icon": "cctv"}
    ]$json$::jsonb,
    
    $json$[
      {"title": "STRUCTURE", "desc": "RCC frame structure on pile foundation."},
      {"title": "WALLS", "desc": "Brickwork with Cement Plastering."},
      {"title": "CEILING", "desc": "Plaster of Paris."},
      {"title": "FLOORING", "desc": "All Rooms / Living / Dining – 2’*2’ Vitrified tiles. Kitchen - Vitrified tiles. Toilets- Ceramic tiles. Lift Lobby- Vitrified tiles."},
      {"title": "KITCHEN", "desc": "Dado of ceramic tiles, up to a height of two feet from the platform. Kitchen platform with granite counter top. Stainless steel sink. Piped Gas Supply. Hot/ Cold water line."},
      {"title": "TOILET", "desc": "Standard ceramic tiles on the wall up to 7ft height. Premium quality bathroom fittings & sanitary ware. CP fittings of premium quality. Provision for geyser. Hot/ Cold water point."},
      {"title": "DOORS & WINDOWS", "desc": "Entrance Door - Solid molded & polished. Internal Door - Flush doors solid core with frames. Anodized aluminum windows."},
      {"title": "WALL FINISH", "desc": "Interior – Plaster of Paris. Exterior - Combination of Textured Paint/ Brush Finish."},
      {"title": "ELECTRICAL", "desc": "Modular switches of superior brands. ISI approved brand of concealed wiring for electricity, telephone and television."},
      {"title": "GENERAL AMENITIES", "desc": "Fully Air Conditioned ground floor lobby. 24X7 Power Back – up for essentials services like lift, lobby, common area and general lighting. Closed circuit TV at the ground level. Automatic high speed elevators of superior make. Intercom facility & infrastructure for DTH TV service. In – house sewerage plant for entire complex. State-of-the-art fire fighting arrangement and extinguishers as required by law. Extensively landscaped garden and driveways. 24 hours treated water supply. Overhead illuminated for compound and street lighting inside the complex."},
      {"title": "__hero_mobile_url__", "desc": "/projects/active-greens/thumbnail.webp"},
      {"title": "__company_logo_url__", "desc": "/projects/active-greens/ruchi-logo.webp"},
      {"title": "__location_map_url__", "desc": "/projects/active-greens/location-map.webp"},
      {"title": "__floor_plans__", "desc": "[{\"title\":\"Tulip Tower\",\"desc\":\"/projects/active-greens/plan-tulip.webp\"},{\"title\":\"Orchid Tower\",\"desc\":\"/projects/active-greens/plan-orchid.webp\"}]"},
      {"title": "__video_section__", "desc": "{\"enabled\":false,\"videoUrl\":\"\",\"thumbnailUrl\":\"\"}"},
      {"title": "__gmb_reviews__", "desc": "{\"enabled\":false,\"googleIconUrl\":\"\",\"starIconUrl\":\"\",\"reviews\":[]}"}
    ]$json$::jsonb,
    
    '/projects/active-greens/location-map.webp',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.636603099951!2d88.38883597603706!3d22.555291233633633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02768f51a44c79%3A0xe5a13318281cb9f2!2sActive%20Acres!5e0!3m2!1sen!2sin!4v1691752959217!5m2!1sen!2sin',
    
    $json$[
      {"name": "JW Marriott", "dist": "1.0 km"},
      {"name": "Hyatt Regency", "dist": "1.0 km"},
      {"name": "Mani Square Mall", "dist": "0.5 km"},
      {"name": "LA Martiniere School", "dist": "2.0 km"},
      {"name": "Sealdah Station", "dist": "2.5 km"},
      {"name": "Ruby Hospital", "dist": "3.0 km"},
      {"name": "Fortis Hospital", "dist": "3.0 km"},
      {"name": "Airport", "dist": "20.0 km"}
    ]$json$::jsonb,
    
    '',
    
    $json$[
      {"src": "/projects/active-greens/gallery-bedroom.webp", "alt": "Show Flat Bedroom"},
      {"src": "/projects/active-greens/gallery-living-room.webp", "alt": "Show Flat Living Room"},
      {"src": "/projects/active-greens/gallery-project-view.webp", "alt": "Active Greens Project View"},
      {"src": "/projects/active-greens/gallery-1.webp", "alt": "Active Greens Exterior Perspective"},
      {"src": "/projects/active-greens/gallery-2.webp", "alt": "Active Greens Entrance Gate"},
      {"src": "/projects/active-greens/gallery-3.webp", "alt": "Active Greens Landscaped Garden"},
      {"src": "/projects/active-greens/gallery-4.webp", "alt": "Active Greens Clubhouse Interiors"},
      {"src": "/projects/active-greens/gallery-5.webp", "alt": "Active Greens Evening Perspective"}
    ]$json$::jsonb,
    
    '/projects/active-greens/brochure.pdf',
    'Active Greens — Luxury 2 & 3 BHK Apartments off E.M. Bypass, Kolkata | Ruchi Realty',
    'Discover Active Greens by Ruchi Realty. Offers 2 & 3 BHK premium apartments off E.M. Bypass, Kolkata, set inside a serene green environment with modern amenities.',
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
