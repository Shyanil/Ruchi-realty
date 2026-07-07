-- ============================================================
-- SQL Setup & Seeding: "One Rajarhat" Project + Subpage
-- 1. Inserts the project row if missing
-- 2. Inserts or updates the subpage content (using local paths)
-- Run this in your Supabase SQL Editor.
-- ============================================================

DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- 1. Check if the project "One Rajarhat" already exists
  SELECT id INTO v_project_id 
  FROM public.projects 
  WHERE title ILIKE '%One Rajarhat%' 
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
      'One Rajarhat',
      'Ready to Move',
      '/projects/one-rajarhat/hero.webp',
      'Rajarhat, Kolkata',
      'The lavish property of ONE RAJARHAT is situated in the smart and planned area of Rajarhat, Kolkata. The luxury residential apartments consist of 3 BHK and 4 BHK apartments and the serviced apartments consist of 1 BHK, 2 BHK and 3 BHK apartments and come with premium floorings and furnishings, making the destination a plush home for one and all.',
      'Residential',
      'Ready to Move',
      true,
      5,
      5
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
    'One Rajarhat',
    'For a world-class living at the heart of the city of joy, step into the one!',
    '/projects/one-rajarhat/logo.webp',
    '/projects/one-rajarhat/hero.webp',
    
    $json$[
      "The lavish property of ONE RAJARHAT is situated in the smart and planned area of Rajarhat, Kolkata. The luxury residential apartments consist of 3 BHK and 4 BHK apartments and the serviced apartments consist of 1 BHK, 2 BHK and 3 BHK apartments and come with premium floorings and furnishings, making the destination a plush home for one and all.",
      "Designed by the renowned Rajinder Kumar Associates (RKA), One Rajarhat offers premium specifications, double-height lobbies, and a massive clubhouse with world-class facilities. Enjoy unmatched connectivity to the IT Hub of Sector V, financial complexes, shopping malls, and the Netaji Subhash Chandra Bose International Airport."
    ]$json$::jsonb,
    
    $json$[
      {"label": "Residential & Serviced", "desc": "Premium luxury & serviced suites.", "icon": "residential"},
      {"label": "1, 2, 3 & 4 BHK", "desc": "Apartments from 900-3000 sq. ft.", "icon": "apartment"},
      {"label": "Prime Rajarhat Location", "desc": "In the heart of Rajarhat, Kolkata.", "icon": "location"},
      {"label": "RKA Architecture", "desc": "Designed by Rajinder Kumar Associates.", "icon": "amenities"}
    ]$json$::jsonb,
    
    $json$[
      {"name": "Gymnasium", "icon": "gym"},
      {"name": "Badminton Court", "icon": "badminton"},
      {"name": "Swimming Pool", "icon": "pool"},
      {"name": "Table Tennis Room", "icon": "table-tennis"},
      {"name": "Yoga/Meditation Area", "icon": "yoga"},
      {"name": "Steam/Sauna Room", "icon": "wellness"},
      {"name": "Pool and Snooker Table", "icon": "snooker"},
      {"name": "Jogging Track", "icon": "jogging"},
      {"name": "Library", "icon": "library"}
    ]$json$::jsonb,
    
    $json$[
      {"title": "STRUCTURE", "desc": "Earthquake resistant RCC frame structure."},
      {"title": "WALLS", "desc": "Brickwork / AAC Block walls with plastering."},
      {"title": "CEILING", "desc": "Plaster of Paris finish."},
      {"title": "FLOORING", "desc": "Imported Marble / Premium Vitrified tiles in living/dining. Wooden flooring in master bedroom. Anti-skid ceramic tiles in toilets and kitchen."},
      {"title": "KITCHEN", "desc": "Granite counter top with stainless steel sink. Premium ceramic tile dado up to 2 feet above counter."},
      {"title": "TOILET", "desc": "Premium sanitary ware (Kohler/Toto or equivalent). CP fittings of Jaguar/Kohler or equivalent. Designer ceramic tiles on walls up to 7 feet."},
      {"title": "DOORS & WINDOWS", "desc": "Main entrance door in solid flush door with veneer. Internal flush doors. Powder-coated aluminum windows."},
      {"title": "WALL FINISH", "desc": "Interior - Plaster of Paris. Exterior - Combination of Textured Paint / Paint Finish."},
      {"title": "ELECTRICAL", "desc": "Concealed copper wiring with modular switches of Havells/Legrand or equivalent. AC points in all bedrooms and living room."},
      {"title": "COMMON FACILITIES", "desc": "Double height decorated entrance lobby. 24x7 security with CCTV surveillance. Advanced fire detection and fighting systems. High-speed elevators. 100% power backup for common areas."},
      {"title": "__hero_mobile_url__", "desc": "/projects/one-rajarhat/hero.webp"},
      {"title": "__company_logo_url__", "desc": "/projects/one-rajarhat/ruchi-logo.webp"},
      {"title": "__location_map_url__", "desc": "/projects/one-rajarhat/seo-image.webp"},
      {"title": "__floor_plans__", "desc": "[{\"title\":\"Master Plan\",\"desc\":\"/projects/one-rajarhat/master-plan.webp\"},{\"title\":\"Typical Floor Plan\",\"desc\":\"/projects/one-rajarhat/floor-plan.webp\"}]"},
      {"title": "__video_section__", "desc": "{\"enabled\":true,\"videoUrl\":\"https://youtu.be/sathFPYaJ6A\",\"thumbnailUrl\":\"\"}"},
      {"title": "__gmb_reviews__", "desc": "{\"enabled\":false,\"googleIconUrl\":\"\",\"starIconUrl\":\"\",\"reviews\":[]}"}
    ]$json$::jsonb,
    
    '/projects/one-rajarhat/seo-image.webp',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0931557008127!2d88.47352331535198!3d22.57608198518174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02753a8cca9bbf%3A0xb351b88e1465e94b!2sOne%20Rajarhat!5e0!3m2!1sen!2sin!4v1691753123456!5m2!1sen!2sin',
    
    $json$[
      {"name": "Sector V IT Hub", "dist": "2.0 km"},
      {"name": "City Centre II", "dist": "3.5 km"},
      {"name": "Tata Medical Centre", "dist": "1.5 km"},
      {"name": "Eco Park", "dist": "1.0 km"},
      {"name": "NSCB International Airport", "dist": "10.0 km"},
      {"name": "Mother's Wax Museum", "dist": "1.2 km"},
      {"name": "Ohio Hospital", "dist": "1.8 km"},
      {"name": "DLF IT Park", "dist": "2.2 km"}
    ]$json$::jsonb,
    
    '',
    
    $json$[
      {"src": "/projects/one-rajarhat/gallery-swimming-pool.webp", "alt": "Swimming Pool"},
      {"src": "/projects/one-rajarhat/gallery-car-parking.webp", "alt": "Car Parking"},
      {"src": "/projects/one-rajarhat/gallery-terrace-view.webp", "alt": "Terrace View"},
      {"src": "/projects/one-rajarhat/gallery-badminton-court.webp", "alt": "Badminton Court"},
      {"src": "/projects/one-rajarhat/gallery-banquet.webp", "alt": "Banquet"},
      {"src": "/projects/one-rajarhat/gallery-gym.webp", "alt": "Gymnasium"},
      {"src": "/projects/one-rajarhat/gallery-living-room.webp", "alt": "Living Room"},
      {"src": "/projects/one-rajarhat/gallery-lobby.webp", "alt": "Lobby"},
      {"src": "/projects/one-rajarhat/gallery-master-bedroom.webp", "alt": "Master Bedroom"},
      {"src": "/projects/one-rajarhat/gallery-aerial-photo.webp", "alt": "Aerial Photo"},
      {"src": "/projects/one-rajarhat/gallery-night-view.webp", "alt": "Night View"}
    ]$json$::jsonb,
    
    '/projects/one-rajarhat/brochure.pdf',
    'One Rajarhat â€” Luxury Residential & Serviced Apartments in Rajarhat, Kolkata | Ruchi Realty',
    'Discover One Rajarhat by Ruchi Realty. Offers ultra-luxury 1, 2, 3 & 4 BHK residential and serviced apartments in Rajarhat, Kolkata, featuring world-class amenities.',
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
