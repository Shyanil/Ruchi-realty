-- ============================================================
-- SQL Setup & Seeding: Active Acres Angelica Editable Sections
-- Run this in your Supabase SQL Editor.
-- Safe to re-run: upserts by project_id.
-- Enables editing of all sections (Overview, Specifications, Amenities,
-- Location, Floor Plans, Gallery, Walkthrough, Reviews, Brochure) directly from Admin panel (/admin).
-- ============================================================

DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- 1. Get or create the "Active Acres" project row
  SELECT id INTO v_project_id 
  FROM public.projects 
  WHERE title ILIKE '%Active Acres%' 
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
      'Active Acres Angelica',
      'Under Construction',
      'assets/projects/active-acres-angelica/hero.webp',
      'Kolkata',
      'Spread over 16.38 Acres with 6 towers of G+22 comprising 1050 Apartments behind JW Marriott, Kolkata.',
      'Residential',
      'Under Construction',
      true,
      3,
      3
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
    'Angelica Active Acres',
    'Spread over 16.38 Acres with 6 towers of G+22 comprising 1050 Apartments',
    'assets/projects/active-acres-angelica/logo.png',
    'assets/projects/active-acres-angelica/hero.webp',
    
    $json$["One of the largest condominium projects of Kolkata, Active Acres, is spread over 16.38 Acres. It has 6 towers of G+22 comprising of 1050 Apartments, containing a mix of 2, 3 & 4 BHK apartments with Penthouses. The idea behind ‘Active Acres’ has been to provide the residents with a superior quality of life. Architects at Agarwal and Agarwal have utilized all their skill and innovation to bring to life the dream of a revolutionary residential complex."]$json$::jsonb,
    
    $json$[
      {"label": "Possession", "desc": "September' 2026", "icon": "location"},
      {"label": "Location", "desc": "Behind JW Marriott, Kolkata", "icon": "home"},
      {"label": "Flats Type", "desc": "4 BHK 2.30 Cr* onwards", "icon": "amenities"},
      {"label": "Outdoor Space", "desc": "6 Acres", "icon": "security"}
    ]$json$::jsonb,
    
    $json$[
      {"name": "Gymnasium", "icon": "gym"},
      {"name": "Library", "icon": "library"},
      {"name": "Table Tennis", "icon": "table-tennis"},
      {"name": "Meditation Room", "icon": "meditation"},
      {"name": "Lounge", "icon": "lounge"},
      {"name": "Squash Courts", "icon": "squash"},
      {"name": "Pool Table", "icon": "pool"},
      {"name": "Air Hockey", "icon": "hockey"},
      {"name": "Football Ground", "icon": "football"},
      {"name": "Play Zone – Billiards Table", "icon": "billiards"}
    ]$json$::jsonb,
    
    $json$[
      {
        "title": "High Speed Elevators & Infrastructure",
        "desc": "Equipped with high-speed passenger elevators, 24 Hours treated water supply, 100% power backup for common areas, underground electric cabling, concrete and interlocking pebble roads, and advanced fire fighting arrangements.",
        "image": "assets/projects/active-acres-angelica/gallery-1.webp"
      },
      {
        "title": "Round-the-Clock CCTV & Safety",
        "desc": "Gated residential community with 24/7 security personnel, comprehensive CCTV surveillance, and intercom facility connecting every apartment to the main security entrance.",
        "image": "assets/projects/active-acres-angelica/gallery-2.webp"
      },
      {
        "title": "Sprawling 6-Acre Outdoor Recreation",
        "desc": "Features 6 acres of landscaped outdoor spaces including manicured lawns, football ground, play zones, paved walking tracks, and peaceful seating areas.",
        "image": "assets/projects/active-acres-angelica/gallery-3.webp"
      },
      {
        "title": "Grand Condominium Architecture",
        "desc": "Designed by renowned architects Agarwal & Agarwal across 16.38 acres featuring 6 towers of G+22 with 1050 apartments, offering a blend of 2, 3 & 4 BHK apartments and penthouses.",
        "image": "assets/projects/active-acres-angelica/gallery-4.webp"
      },
      {"title": "__hero_mobile_url__", "desc": "assets/projects/active-acres-angelica/hero-sm.webp"},
      {"title": "__company_logo_url__", "desc": "assets/projects/active-acres-angelica/ruchi_logo.png"},
      {"title": "__gmb_google_icon_url__", "desc": "assets/projects/active-acres-angelica/g-icon.png"},
      {"title": "__gmb_star_icon_url__", "desc": "assets/projects/active-acres-angelica/5-star.png"},
      {"title": "__location_map_url__", "desc": "assets/projects/active-acres-angelica/location-map.jpg"},
      {"title": "__floor_plans__", "desc": "[{\"title\":\"Master Plan\",\"desc\":\"assets/projects/active-acres-angelica/location-map.jpg\"},{\"title\":\"4 BHK Unit Plan\",\"desc\":\"assets/projects/active-acres-angelica/location-map.jpg\"},{\"title\":\"3 BHK Unit Plan\",\"desc\":\"assets/projects/active-acres-angelica/location-map.jpg\"}]"},
      {"title": "__video_section__", "desc": "{\"enabled\":true,\"videoUrl\":\"https://youtu.be/GTYs3ZynAQU\",\"thumbnailUrl\":\"assets/projects/active-acres-angelica/video-thumbnail.jpg\"}"},
      {"title": "__gmb_reviews__", "desc": "{\"enabled\":true,\"googleIconUrl\":\"assets/projects/active-acres-angelica/g-icon.png\",\"starIconUrl\":\"assets/projects/active-acres-angelica/5-star.png\",\"reviews\":[{\"author\":\"Ramesh Kumar\",\"rating\":5,\"text\":\"Excellent residential tower inside Active Acres. The construction quality is top-notch, and the amenities like the library and table tennis are very well maintained. Extremely peaceful environment.\",\"time\":\"1 month ago\"},{\"author\":\"Ananya Sen\",\"rating\":5,\"text\":\"Beautiful landscape gardens and wide roads. The new Angelica tower has a great location in Tangra, Kolkata, with very good connectivity to IT hubs and E.M. Bypass.\",\"time\":\"2 weeks ago\"},{\"author\":\"Debabrata Bose\",\"rating\":5,\"text\":\"The layout of the apartment is very spacious with plenty of natural light and ventilation. Very satisfied with the Ruchi Realty team and their customer service.\",\"time\":\"3 months ago\"}]}"}
    ]$json$::jsonb,
    
    'assets/projects/active-acres-angelica/location-map.jpg',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.636603099951!2d88.38883597603706!3d22.555291233633633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02768f51a44c79%3A0xe5a13318281cb9f2!2sActive%20Acres!5e0!3m2!1sen!2sin!4v1691752959217!5m2!1sen!2sin',
    
    $json$[
      {"name": "JW Marriott", "dist": "1 km"},
      {"name": "Hospital", "dist": "3 km"},
      {"name": "Well Known Schools", "dist": "2 km"},
      {"name": "Mall", "dist": "2 km"},
      {"name": "International Airport", "dist": "20 km"}
    ]$json$::jsonb,
    
    'https://youtu.be/GTYs3ZynAQU',
    
    $json$[
      {"src": "assets/projects/active-acres-angelica/gallery-1.webp", "alt": "Angelica Exterior Perspective"},
      {"src": "assets/projects/active-acres-angelica/gallery-2.webp", "alt": "Angelica Entrance Lobby"},
      {"src": "assets/projects/active-acres-angelica/gallery-3.webp", "alt": "Angelica Landscape View"},
      {"src": "assets/projects/active-acres-angelica/gallery-4.webp", "alt": "Angelica Clubhouse Interiors"},
      {"src": "assets/projects/active-acres-angelica/gallery-5.webp", "alt": "Angelica Show Flat Bedroom"},
      {"src": "assets/projects/active-acres-angelica/gallery-6.webp", "alt": "Angelica Show Flat Living Room"}
    ]$json$::jsonb,
    
    'assets/projects/active-acres-angelica/brochure.pdf',
    'Active Acres Angelica | Premium 3 & 4 BHK Apartments in Kolkata | Ruchi Realty',
    'Explore Active Acres Angelica by Ruchi Realty. Located behind JW Marriott, Kolkata, this premium residential project offers luxury 3 BHK and 4 BHK apartments with 6 acres of outdoor space.',
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
