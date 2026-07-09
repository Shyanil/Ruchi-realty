-- ============================================================
-- Seed: Ruchi Lifescapes Bhopal project + public project subpage
-- Tables used by the current codebase:
--   public.projects
--   public.project_subpages
-- This script is safe to rerun. It updates/creates only the Bhopal
-- Ruchi Lifescapes row and deletes/reseeds only that project's subpage row.
-- ============================================================

BEGIN;

DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- Find an existing Bhopal Lifescapes row without touching Lifescapes Indore.
  SELECT id INTO v_project_id
  FROM public.projects
  WHERE title ILIKE 'Ruchi Lifescapes%'
    AND location ILIKE '%Bhopal%'
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
      'Ruchi Lifescapes',
      'Luxury living in Bhopal',
      '/projects/lifescapes-bhopal/card.webp',
      'Bhopal, Madhya Pradesh',
      'Discover luxury living at Ruchi Lifescapes Bhopal, offering residential options from 1000 to 4000 sqft. and ample amenities.',
      'Residential',
      'Ready to Move',
      true,
      13,
      13
    )
    RETURNING id INTO v_project_id;
  ELSE
    UPDATE public.projects
    SET
      title = 'Ruchi Lifescapes',
      tag = 'Luxury living in Bhopal',
      image_url = '/projects/lifescapes-bhopal/card.webp',
      location = 'Bhopal, Madhya Pradesh',
      description = 'Discover luxury living at Ruchi Lifescapes Bhopal, offering residential options from 1000 to 4000 sqft. and ample amenities.',
      type = 'Residential',
      status = 'Ready to Move',
      featured = true,
      sort_order = 13,
      feature_order = 13
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
    'Ruchi Lifescapes',
    'Discover luxury living at Ruchi Lifescapes Bhopal, offering residential options from 1000 to 4000 sqft. and ample amenities.',
    '/projects/lifescapes-bhopal/logo.png',
    '/projects/lifescapes-bhopal/card.webp',

    $json$[
      "Discover the pinnacle of luxury living at Ruchi Lifescapes Bhopal, where every aspect of convenience and elegance converges seamlessly. Situated in the heart of Bhopal, Madhya Pradesh, this prestigious real estate project offers a lifestyle that surpasses all expectations.",
      "Spanning across one of the most sought-after areas in the city, Ruchi Lifescapes Bhopal presents a diverse range of living spaces, including row houses, apartments, and shops, with sizes ranging from 1000 to 4000 square feet. Whether you are seeking a cozy abode or a spacious dwelling, our project caters to all preferences.",
      "What sets Ruchi Lifescapes apart is not just its luxurious accommodations but also its extensive array of amenities designed to enhance your quality of life. Enjoy leisurely strolls in lush parks, rejuvenate your senses in the swimming pool, maintain your fitness regime in the well-equipped gymnasium, or seek solace in the serene temple. Additionally, engage in friendly matches at the tennis court, spend quality time with your little ones in the children's park, or unwind with a game of squash.",
      "Furthermore, Ruchi Lifescapes Bhopal boasts an enviable location, providing easy access to key destinations such as hotels, schools, hospitals, malls, and railway stations. Whether you are commuting for work or leisure, you will appreciate the convenience of our prime location.",
      "To embark on your journey towards luxury living, schedule a site visit to explore our meticulously crafted residences and amenities. Our team is ready to assist you in registering for discussions or addressing any inquiries you may have. Simply call us to take the first step towards securing your dream home.",
      "At Ruchi Lifescapes Bhopal, we redefine urban living by combining comfort, convenience, and sophistication, ensuring that every moment spent within our premises is nothing short of extraordinary."
    ]$json$::jsonb,

    -- Overview cards use the same icon keys/assets already used by recent pages.
    $json$[
      {"label":"1000-4000 sqft. & Shops","desc":"Residential options and shops planned across practical sizes.","icon":"size"},
      {"label":"Row Houses & Apartments","desc":"A mix of row houses, apartments, and shops.","icon":"infrastructure"},
      {"label":"Ample Amenities","desc":"Lifestyle amenities for daily comfort and recreation.","icon":"amenities"},
      {"label":"Prime Location","desc":"Connected Bhopal address close to key destinations.","icon":"location"}
    ]$json$::jsonb,

    -- Amenity icon keys reuse the existing project subpage SVG icon system.
    $json$[
      {"name":"Tennis Court","icon":"tennis"},
      {"name":"Swimming Pool","icon":"pool"},
      {"name":"Gymnasium","icon":"gym"},
      {"name":"Temple","icon":"temple"},
      {"name":"Children Park","icon":"playground"},
      {"name":"Club House","icon":"club"},
      {"name":"Park","icon":"garden"},
      {"name":"Squash","icon":"tennis"}
    ]$json$::jsonb,

    $json$[
      {"title":"__floor_plans__","desc":"[{\"title\":\"Master Layout\",\"desc\":\"/projects/lifescapes-bhopal/floor-master.jpg\"},{\"title\":\"2.5 BHK\",\"desc\":\"/projects/lifescapes-bhopal/floor-2-5-bhk.jpg\"},{\"title\":\"3 BHK\",\"desc\":\"/projects/lifescapes-bhopal/floor-3-bhk.jpg\"},{\"title\":\"Orchid Row House\",\"desc\":\"/projects/lifescapes-bhopal/floor-orchid-row-house.jpg\"},{\"title\":\"Orchid Row House 2\",\"desc\":\"/projects/lifescapes-bhopal/floor-orchid-row-house-2.jpg\"},{\"title\":\"Tulip Twin Bungalow\",\"desc\":\"/projects/lifescapes-bhopal/floor-tulip-twin-bungalow.jpg\"},{\"title\":\"Villa\",\"desc\":\"/projects/lifescapes-bhopal/floor-villa.jpg\"}]"},
      {"title":"__video_section__","desc":"{\"enabled\":false,\"videoUrl\":\"\",\"thumbnailUrl\":\"\"}"}
    ]$json$::jsonb,

    '/projects/lifescapes-bhopal/card.webp',
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d29343.66289393302!2d77.480543!3d23.171738!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c4151987d099f%3A0x67b31fc6a7762900!2sRuchi%20Lifescape%2C%20Jatkhedi%2C%20Bhopal%2C%20Madhya%20Pradesh%20462047%2C%20India!5e0!3m2!1sen!2sus!4v1691840678888!5m2!1sen!2sus',
    $json$[
      {"name":"Hotel","dist":"1 km"},
      {"name":"School","dist":"2 km"},
      {"name":"Airport","dist":"18 km"},
      {"name":"Hospital","dist":"3 km"},
      {"name":"Mall","dist":"9 km"},
      {"name":"Railway Station","dist":"7 km"}
    ]$json$::jsonb,
    '',

    $json$[
      {"src":"/projects/lifescapes-bhopal/gallery-1.jpg","alt":"Ruchi Lifescapes Bhopal gallery image 1"},
      {"src":"/projects/lifescapes-bhopal/gallery-2.jpg","alt":"Ruchi Lifescapes Bhopal gallery image 2"},
      {"src":"/projects/lifescapes-bhopal/gallery-3.jpg","alt":"Ruchi Lifescapes Bhopal gallery image 3"},
      {"src":"/projects/lifescapes-bhopal/gallery-4.jpg","alt":"Ruchi Lifescapes Bhopal gallery image 4"},
      {"src":"/projects/lifescapes-bhopal/gallery-5.jpg","alt":"Ruchi Lifescapes Bhopal gallery image 5"},
      {"src":"/projects/lifescapes-bhopal/gallery-6.jpg","alt":"Ruchi Lifescapes Bhopal gallery image 6"}
    ]$json$::jsonb,

    '/projects/lifescapes-bhopal/brochure.pdf',
    'Ruchi Lifescapes Bhopal - Ruchi Realty',
    'Discover luxury living at Ruchi Lifescapes Bhopal, offering residential options from 1000 to 4000 sqft. and ample amenities.',
    true
  );
END $$;

COMMIT;
