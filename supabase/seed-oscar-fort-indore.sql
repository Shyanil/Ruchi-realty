-- ============================================================
-- Seed: Oscar Fort Indore project + public project subpage
-- Tables used by the current codebase:
--   public.projects
--   public.project_subpages
-- This script is safe to rerun. It updates/creates only the Oscar Fort
-- Indore row and deletes/reseeds only that project's subpage row.
-- ============================================================

BEGIN;

DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- Find the existing Oscar Fort row in Indore, if present.
  SELECT id INTO v_project_id
  FROM public.projects
  WHERE title ILIKE 'Oscar Fort%'
    AND location ILIKE '%Indore%'
  ORDER BY created_at ASC
  LIMIT 1;

  -- Insert or update the project card/listing row used by homepage and projects page.
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
    ) VALUES (
      gen_random_uuid(),
      'Oscar Fort',
      'Your Journey To a Royal Living Begins Here',
      '/projects/oscar-fort-indore/hero.jpg',
      'Indore, Madhya Pradesh',
      'Experience royal living at Oscar Fort, a premium gated township in Indore with limited-edition plots, green open spaces, modern amenities, and a lifestyle crafted for memorable everyday moments.',
      'Township',
      'Ongoing',
      true,
      16,
      16
    )
    RETURNING id INTO v_project_id;
  ELSE
    UPDATE public.projects
    SET
      title = 'Oscar Fort',
      tag = 'Your Journey To a Royal Living Begins Here',
      image_url = '/projects/oscar-fort-indore/hero.jpg',
      location = 'Indore, Madhya Pradesh',
      description = 'Experience royal living at Oscar Fort, a premium gated township in Indore with limited-edition plots, green open spaces, modern amenities, and a lifestyle crafted for memorable everyday moments.',
      type = 'Township',
      status = 'Ongoing',
      featured = true,
      sort_order = 16,
      feature_order = 16
    WHERE id = v_project_id;
  END IF;

  -- Cleanup only this project's subpage row before reseeding child JSON content.
  DELETE FROM public.project_subpages
  WHERE project_id = v_project_id;

  -- Insert the public project detail content. Current schema stores section
  -- collections as JSONB and floor/video metadata as sentinel entries in
  -- specifications, matching recent project seeds.
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
  ) VALUES (
    v_project_id,
    'Oscar Fort',
    'Your Journey To a Royal Living begins here',
    '/projects/oscar-fort-indore/logo.png',
    '/projects/oscar-fort-indore/hero.jpg',

    $json$[
      "Memorable moments with a royal touch make all the difference. Each occasion of your life deserves a royal welcome. It is time that you get it every single day of your life. It is your time to rule."
    ]$json$::jsonb,

    -- Overview cards use the same icon keys/assets already used by recent pages.
    $json$[
      {"label":"Premium Township","desc":"A premium township close to the city.","icon":"infrastructure"},
      {"label":"Limited Edition Plots","desc":"A limited-edition plotted community for the privileged few.","icon":"size"},
      {"label":"Gated Community","desc":"A planned community with security and everyday comfort.","icon":"location"},
      {"label":"Royal Living","desc":"A lifestyle crafted around memorable everyday moments.","icon":"amenities"}
    ]$json$::jsonb,

    -- Amenity icon keys reuse the existing project subpage icon system.
    $json$[
      {"name":"Highly Secured Fort Wall","icon":"security"},
      {"name":"Zero Edge Swimming Pool","icon":"pool"},
      {"name":"Jacuzzi / Steam / Sauna","icon":"spa"},
      {"name":"Yoga & Meditation Area","icon":"yoga"},
      {"name":"Amphitheatre","icon":"club"},
      {"name":"Indoor & Outdoor Gym","icon":"gym"},
      {"name":"Kids Play Area","icon":"playground"},
      {"name":"Senior Citizen Garden","icon":"garden"},
      {"name":"Outdoor Games Area","icon":"tennis"},
      {"name":"Library","icon":"club"},
      {"name":"All Modern Securities System","icon":"security"},
      {"name":"CCTV Surveillance","icon":"security"},
      {"name":"Banquet Hall","icon":"club"},
      {"name":"Fort Grand Entry","icon":"infrastructure"},
      {"name":"Avenue Water Features","icon":"garden"},
      {"name":"Outdoor Games (Cricket Mini Turf / Basketball Court)","icon":"tennis"},
      {"name":"Underground Services (Electric & Wifi Cables)","icon":"infrastructure"},
      {"name":"Indoor Games Room (Chess / Carrom / Card Room / Table Tennis / Billiards)","icon":"club"}
    ]$json$::jsonb,

    $json$[
      {"title":"A Unique Abode for You","desc":"Your Highness: For those whose life has a distinct flavour of royalty, here's an opportunity crafted just for you. A dwelling for the privileged few, it's a limited edition. Just a few plots at this premium township close to the city. Come, live the royal life."},
      {"title":"Rule Your Fort","desc":"Your Highness: Oscar Fort offers more than just materialistic supremacy. It will have a deeper meaning - it will be your kingdom of dreams and happiness. With a whole new approach to leisure spaces, you can express your joy without interruptions."},
      {"title":"Vast Expanses Beckon You","desc":"Your Highness: Oscar Fort sprawls over several acres with the serenity of a country township and modern amenities of city life. Functional areas for all age groups make Oscar Fort a one-in-a-kind gated community."},
      {"title":"A Royal Canvas","desc":"Your Highness: A breathtaking landscape with lush green surroundings and well-kept grounds make it a perfect home sweet home community for the kings and queens, princes and princesses."},
      {"title":"Home Loan Available from HDFC","desc":"Banking partner section found in the source. Logo asset: /projects/oscar-fort-indore/hdfc-home-loan-logo.png"},
      {"title":"Project Address","desc":"Oscar Fort, Bicholi Hapsi, Near Mayank Blue Water Park, Indore. RERA: P-IND-22-3414."},
      {"title":"Layout Legend","desc":"Entrance Court, Formal Garden-01, Roads, Plots, Formal Garden-02, Active Area-01 (MUGA), Baoli Style Amphitheatre, Kids Play Zone, Avenue, Active Area-02, Leisure Garden, Project Signage, Guard Room, Parterres, Lawns, Water Feature Wall, Baradari."},
      {"title":"__floor_plans__","desc":"[{\"title\":\"Layout Plan\",\"desc\":\"/projects/oscar-fort-indore/layout-plan.jpg\"},{\"title\":\"Exciting Location\",\"desc\":\"/projects/oscar-fort-indore/exciting-location.jpg\"},{\"title\":\"Upcoming Phase\",\"desc\":\"/projects/oscar-fort-indore/upcoming-phase.jpg\"}]"},
      {"title":"__video_section__","desc":"{\"enabled\":true,\"title\":\"Walk Through\",\"videoUrl\":\"https://player.vimeo.com/video/735387729?h=0982bb9b19\",\"thumbnailUrl\":\"/projects/oscar-fort-indore/hero.jpg\"}"}
    ]$json$::jsonb,

    '/projects/oscar-fort-indore/exciting-location.jpg',
    '',
    $json$[
      {"name":"Bicholi Hapsi","dist":"Indore"},
      {"name":"Mayank Blue Water Park","dist":"Nearby"},
      {"name":"RERA","dist":"P-IND-22-3414"}
    ]$json$::jsonb,
    'https://player.vimeo.com/video/735387729?h=0982bb9b19',

    $json$[
  {
    "src": "/projects/oscar-fort-indore/gallery-1.jpg",
    "alt": "Oscar Fort gallery image 1"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-2.jpg",
    "alt": "Oscar Fort gallery image 2"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-3.jpg",
    "alt": "Oscar Fort gallery image 3"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-4.jpg",
    "alt": "Oscar Fort gallery image 4"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-5.jpg",
    "alt": "Oscar Fort gallery image 5"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-6.jpg",
    "alt": "Oscar Fort gallery image 6"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-7.jpg",
    "alt": "Oscar Fort gallery image 7"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-8.jpg",
    "alt": "Oscar Fort gallery image 8"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-9.jpg",
    "alt": "Oscar Fort gallery image 9"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-10.jpg",
    "alt": "Oscar Fort gallery image 10"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-11.jpg",
    "alt": "Oscar Fort gallery image 11"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-12.jpg",
    "alt": "Oscar Fort gallery image 12"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-13.jpg",
    "alt": "Oscar Fort gallery image 13"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-14.jpg",
    "alt": "Oscar Fort gallery image 14"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-15.jpg",
    "alt": "Oscar Fort gallery image 15"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-16.jpg",
    "alt": "Oscar Fort gallery image 16"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-17.jpg",
    "alt": "Oscar Fort gallery image 17"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-18.jpg",
    "alt": "Oscar Fort gallery image 18"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-19.jpg",
    "alt": "Oscar Fort gallery image 19"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-20.jpg",
    "alt": "Oscar Fort gallery image 20"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-21.jpg",
    "alt": "Oscar Fort gallery image 21"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-22.jpg",
    "alt": "Oscar Fort gallery image 22"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-23.jpg",
    "alt": "Oscar Fort gallery image 23"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-24.jpg",
    "alt": "Oscar Fort gallery image 24"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-25.jpg",
    "alt": "Oscar Fort gallery image 25"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-26.jpg",
    "alt": "Oscar Fort gallery image 26"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-27.jpg",
    "alt": "Oscar Fort gallery image 27"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-28.jpg",
    "alt": "Oscar Fort gallery image 28"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-29.jpg",
    "alt": "Oscar Fort gallery image 29"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-30.jpg",
    "alt": "Oscar Fort gallery image 30"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-31.jpg",
    "alt": "Oscar Fort gallery image 31"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-32.jpg",
    "alt": "Oscar Fort gallery image 32"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-33.jpg",
    "alt": "Oscar Fort gallery image 33"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-34.jpg",
    "alt": "Oscar Fort gallery image 34"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-35.jpg",
    "alt": "Oscar Fort gallery image 35"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-36.jpg",
    "alt": "Oscar Fort gallery image 36"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-37.jpg",
    "alt": "Oscar Fort gallery image 37"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-38.jpg",
    "alt": "Oscar Fort gallery image 38"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-39.jpg",
    "alt": "Oscar Fort gallery image 39"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-40.jpg",
    "alt": "Oscar Fort gallery image 40"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-41.jpg",
    "alt": "Oscar Fort gallery image 41"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-42.jpg",
    "alt": "Oscar Fort gallery image 42"
  },
  {
    "src": "/projects/oscar-fort-indore/gallery-43.jpg",
    "alt": "Oscar Fort gallery image 43"
  }
]$json$::jsonb,

    '',
    'Oscar Fort Indore - Ruchi Realty',
    'Experience royal living at Oscar Fort, a premium gated township in Indore with limited-edition plots, green open spaces, modern amenities, and a lifestyle crafted for memorable everyday moments.',
    true
  );
END $$;

COMMIT;
