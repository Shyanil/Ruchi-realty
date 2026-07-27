-- ============================================================
-- SQL Setup & Seeding: One Rajarhat Editable Sections
-- Run this in your Supabase SQL Editor.
-- Safe to re-run: upserts by project_id.
-- Enables editing of all sections (Overview, Specifications, Amenities,
-- Location, Floor Plans, Gallery, Walkthrough, Reviews, Brochure) directly from Admin panel (/admin).
-- ============================================================

DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- 1. Get or create the "One Rajarhat" project row
  SELECT id INTO v_project_id 
  FROM public.projects 
  WHERE title ILIKE '%One Rajarhat%' 
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
      'One Rajarhat',
      'Ready to Move',
      'assets/projects/one-rajarhat/hero.jpg',
      'Rajarhat, Kolkata',
      'The lavish property of ONE RAJARHAT is situated in the smart and planned area of Rajarhat, Kolkata.',
      'Residential',
      'Ready to Move',
      true,
      5,
      5
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
    'One Rajarhat',
    'For a world-class living at the heart of the city of joy, step into the one!',
    '/projects/one-rajarhat/logo.webp',
    'assets/projects/one-rajarhat/hero.jpg',
    
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
      {
        "title": "Earthquake-Resistant Structure & Masonry",
        "desc": "Engineered RCC frame structure built for maximum earthquake safety. Precision brickwork and AAC block walls with smooth Plaster of Paris interior finishing.",
        "image": "/projects/one-rajarhat/gallery-aerial-photo.webp"
      },
      {
        "title": "Imported Marble & Hardwood Flooring",
        "desc": "Living and dining areas featuring imported marble and premium vitrified tiles. Master bedrooms with warm wooden laminate flooring, anti-skid ceramic tiles in kitchens and bathrooms, and veneer finish main entrance doors.",
        "image": "/projects/one-rajarhat/gallery-living-room.webp"
      },
      {
        "title": "High-End Sanitary & Modular Fittings",
        "desc": "Premium sanitary ware and CP fittings from Kohler/Toto/Jaquar. Polished granite kitchen countertops with stainless steel sinks and designer ceramic wall tiles up to 7 feet.",
        "image": "/projects/one-rajarhat/gallery-master-bedroom.webp"
      },
      {
        "title": "Advanced Electrification & Common Facilities",
        "desc": "Concealed copper wiring with modular switches (Havells/Legrand), VRV/split AC provision, double-height grand entrance lobby, 24/7 CCTV surveillance, high-speed elevators, and 100% power backup for common areas.",
        "image": "/projects/one-rajarhat/gallery-lobby.webp"
      },
      {"title": "__hero_mobile_url__", "desc": "assets/projects/one-rajarhat/hero.jpg"},
      {"title": "__company_logo_url__", "desc": "/projects/one-rajarhat/ruchi-logo.webp"},
      {"title": "__location_map_url__", "desc": "/projects/one-rajarhat/location-map.webp"},
      {"title": "__floor_plans__", "desc": "[{\"title\":\"Master Plan\",\"desc\":\"/projects/one-rajarhat/master-plan.webp\"},{\"title\":\"Typical Floor Plan\",\"desc\":\"/projects/one-rajarhat/floor-plan.webp\"}]"},
      {"title": "__video_section__", "desc": "{\"enabled\":true,\"videoUrl\":\"https://youtu.be/sathFPYaJ6A\",\"thumbnailUrl\":\"\"}"},
      {"title": "__gmb_reviews__", "desc": "{\"enabled\":false,\"googleIconUrl\":\"\",\"starIconUrl\":\"\",\"reviews\":[]}"}
    ]$json$::jsonb,
    
    '/projects/one-rajarhat/location-map.webp',
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
    
    'https://youtu.be/sathFPYaJ6A',
    
    $json$[
      {"src": "/projects/one-rajarhat/gallery-swimming-pool.webp", "alt": "Swimming Pool"},
      {"src": "/projects/one-rajarhat/gallery-car-parking.webp", "alt": "Car Parking"},
      {"src": "/projects/one-rajarhat/gallery-terrace-view.webp", "alt": "Terrace View"},
      {"src": "/projects/one-rajarhat/gallery-badminton-court.webp", "alt": "Badminton Court"},
      {"src": "/projects/one-rajarhat/gallery-banquet.webp", "alt": "Banquet Hall"},
      {"src": "/projects/one-rajarhat/gallery-gym.webp", "alt": "State-of-the-Art Gymnasium"},
      {"src": "/projects/one-rajarhat/gallery-living-room.webp", "alt": "Spacious Living Room"},
      {"src": "/projects/one-rajarhat/gallery-lobby.webp", "alt": "Double Height Entrance Lobby"},
      {"src": "/projects/one-rajarhat/gallery-master-bedroom.webp", "alt": "Luxury Master Bedroom"},
      {"src": "/projects/one-rajarhat/gallery-aerial-photo.webp", "alt": "Aerial View of One Rajarhat"},
      {"src": "/projects/one-rajarhat/gallery-night-view.webp", "alt": "Night Elevation View"}
    ]$json$::jsonb,
    
    '/projects/one-rajarhat/brochure.pdf',
    'One Rajarhat — Luxury Residential & Serviced Apartments in Rajarhat, Kolkata | Ruchi Realty',
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
    is_published = EXCLUDED.is_published,
    updated_at = timezone('utc'::text, now());
END $$;
