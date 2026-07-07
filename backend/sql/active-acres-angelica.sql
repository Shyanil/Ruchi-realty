-- ============================================================
-- SQL Setup & Seeding: "Active Acres Angelica" Project + Subpage
-- 1. Inserts the project row if missing (using correct values)
-- 2. Inserts or updates the subpage content (using local code paths)
-- Run this in your Supabase SQL Editor.
-- ============================================================

DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- 1. Check if the project "Active Acres" already exists
  SELECT id INTO v_project_id 
  FROM public.projects 
  WHERE title ILIKE '%Active Acres%' 
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
      'Active Acres',
      'Ready to Move',
      'assets/projects/active-acres.webp',
      'Kolkata',
      'Spacious residences inside Active Acres, Kolkata. Premium high-rise residential living with world-class amenities.',
      'Residential',
      'Ready to Move',
      true,
      3,
      3
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
    'Active Acres Angelica',
    'Premium High-Rise Residential Living',
    'assets/projects/active-acres-angelica/logo.png',
    'assets/projects/active-acres-angelica/hero.webp',
    
    $json$["Angelica is the premium high-rise residential tower at Active Acres, Kolkata. Located strategically in Tangra, it offers beautifully crafted 3 BHK and 4 BHK residences designed for modern families seeking a balance of luxury, community, and serenity.", "With sprawling green landscape features, state-of-the-art amenities, and unmatched connectivity to E.M. Bypass, Salt Lake Sector V, and Park Street, Angelica is the ultimate address to grow, live, and create beautiful memories with your loved ones."]$json$::jsonb,
    
    $json$[{"label": "Prime Location", "desc": "Located in Tangra, just off the E.M. Bypass connector.", "icon": "location"}, {"label": "Spacious Living", "desc": "Thoughtfully designed 3 BHK & 4 BHK apartments.", "icon": "home"}, {"label": "Rich Amenities", "desc": "Exclusive gymnasium, library, and table tennis.", "icon": "amenities"}, {"label": "Secure Living", "desc": "24/7 gated security with CCTV surveillance.", "icon": "security"}]$json$::jsonb,
    
    $json$[{"name": "Gymnasium", "icon": "gym"}, {"name": "Library", "icon": "library"}, {"name": "Table Tennis", "icon": "table-tennis"}]$json$::jsonb,
    
    $json$[
      {"title": "Lush Central Lawn", "desc": "Beautifully manicured lawns providing open green spaces for residents."},
      {"title": "Kids Play Area", "desc": "A safe and vibrant outdoor play area designed for children."},
      {"title": "Senior Citizen Corner", "desc": "Quiet, comfortable seating zones set in landscaped surroundings."},
      {"title": "Paved Walkways", "desc": "Dedicated jogging and walking tracks running throughout the community."},
      {"title": "__hero_mobile_url__", "desc": "assets/projects/active-acres-angelica/hero-sm.webp"},
      {"title": "__company_logo_url__", "desc": "assets/projects/active-acres-angelica/ruchi_logo.png"},
      {"title": "__gmb_google_icon_url__", "desc": "assets/projects/active-acres-angelica/g-icon.png"},
      {"title": "__gmb_star_icon_url__", "desc": "assets/projects/active-acres-angelica/5-star.png"},
      {"title": "__location_map_url__", "desc": "assets/projects/active-acres-angelica/location-map.jpg"},
      {"title": "__floor_plans__", "desc": "[{\"title\":\"3 BHK Unit Plan\",\"desc\":\"assets/projects/active-acres-angelica/location-map.jpg\"},{\"title\":\"4 BHK Unit Plan\",\"desc\":\"assets/projects/active-acres-angelica/location-map.jpg\"}]"},
      {"title": "__video_section__", "desc": "{\"enabled\":true,\"videoUrl\":\"https://youtu.be/GTYs3ZynAQU\",\"thumbnailUrl\":\"assets/projects/active-acres-angelica/video-thumbnail.jpg\"}"},
      {"title": "__gmb_reviews__", "desc": "{\"enabled\":true,\"googleIconUrl\":\"assets/projects/active-acres-angelica/g-icon.png\",\"starIconUrl\":\"assets/projects/active-acres-angelica/5-star.png\",\"reviews\":[{\"author\":\"Ramesh Kumar\",\"rating\":5,\"text\":\"Excellent residential tower inside Active Acres. The construction quality is top-notch, and the amenities like the library and table tennis are very well maintained. Extremely peaceful environment.\",\"time\":\"1 month ago\"},{\"author\":\"Ananya Sen\",\"rating\":5,\"text\":\"Beautiful landscape gardens and wide roads. The new Angelica tower has a great location in Tangra, Kolkata, with very good connectivity to IT hubs and E.M. Bypass.\",\"time\":\"2 weeks ago\"},{\"author\":\"Debabrata Bose\",\"rating\":5,\"text\":\"The layout of the apartment is very spacious with plenty of natural light and ventilation. Very satisfied with the Ruchi Realty team and their customer service.\",\"time\":\"3 months ago\"}]}"}
    ]$json$::jsonb,
    
    'assets/projects/active-acres-angelica/location-map.jpg',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.636603099951!2d88.38883597603706!3d22.555291233633633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02768f51a44c79%3A0xe5a13318281cb9f2!2sActive%20Acres!5e0!3m2!1sen!2sin!4v1691752959217!5m2!1sen!2sin',
    
    $json$[{"name": "E.M. Bypass", "dist": "1.0 km"}, {"name": "ITC Sonar", "dist": "1.5 km"}, {"name": "Science City", "dist": "2.0 km"}, {"name": "Park Street", "dist": "4.5 km"}, {"name": "Kolkata Airport", "dist": "16.0 km"}]$json$::jsonb,
    
    'GTYs3ZynAQU',
    
    $json$[{"src": "assets/projects/active-acres-angelica/gallery-1.webp", "alt": "Angelica Exterior Perspective"}, {"src": "assets/projects/active-acres-angelica/gallery-2.webp", "alt": "Angelica Entrance Lobby"}, {"src": "assets/projects/active-acres-angelica/gallery-3.webp", "alt": "Angelica Landscape View"}, {"src": "assets/projects/active-acres-angelica/gallery-4.webp", "alt": "Angelica Clubhouse Interiors"}, {"src": "assets/projects/active-acres-angelica/gallery-5.webp", "alt": "Angelica Show Flat Bedroom"}, {"src": "assets/projects/active-acres-angelica/gallery-6.webp", "alt": "Angelica Show Flat Living Room"}]$json$::jsonb,
    
    'assets/projects/active-acres-angelica/brochure.pdf',
    'Active Acres Angelica — Premium 3 & 4 BHK Apartments in Kolkata | Ruchi Realty',
    'Explore Active Acres Angelica by Ruchi Realty. Located in Kolkata, this premium residential project offers luxury 3 BHK and 4 BHK apartments with world-class amenities.',
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
