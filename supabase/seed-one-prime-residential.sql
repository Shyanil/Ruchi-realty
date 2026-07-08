-- ============================================================
-- Seed: One Prime Residential project + public project subpage
-- Tables used by the current codebase:
--   public.projects
--   public.project_subpages
-- This script is safe to rerun. It updates/creates only One Prime Residential
-- and deletes/reseeds only that project's subpage row.
-- ============================================================

BEGIN;

DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- Find an existing One Prime row, including older records titled "One Prime".
  SELECT id INTO v_project_id
  FROM public.projects
  WHERE title ILIKE 'One Prime%'
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
      'One Prime Residential',
      'A Smart Upgrade To Premium Living',
      '/projects/one-prime-residential/card.webp',
      'New Town, Kolkata',
      'Experience luxury living at One Prime Residential, offering exquisite 2, 3 BHK apartments with world-class amenities in Newtown Action Area 1.',
      'Residential',
      'Ongoing',
      true,
      2,
      2
    )
    RETURNING id INTO v_project_id;
  ELSE
    UPDATE public.projects
    SET
      title = 'One Prime Residential',
      tag = 'A Smart Upgrade To Premium Living',
      image_url = '/projects/one-prime-residential/card.webp',
      location = 'New Town, Kolkata',
      description = 'Experience luxury living at One Prime Residential, offering exquisite 2, 3 BHK apartments with world-class amenities in Newtown Action Area 1.',
      type = 'Residential',
      status = 'Ongoing',
      featured = true,
      sort_order = 2,
      feature_order = 2
    WHERE id = v_project_id;
  END IF;

  -- Cleanup only this project's subpage row before reseeding child JSON content.
  DELETE FROM public.project_subpages
  WHERE project_id = v_project_id;

  -- Insert the public project detail content. The current schema stores section
  -- collections as JSONB and extra floor/video/construction metadata as
  -- sentinel entries in specifications, matching the recent project seeds.
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
    'One Prime Residential',
    'A Smart Upgrade To Premium Living',
    '/projects/one-prime-residential/logo.webp',
    '/projects/one-prime-residential/card.webp',

    $json$[
      "Give your busy lifestyle the antidote of nature, luxury, relaxation and ease for a blissful living experience. Step inside a space encapsulating the essence of extravagance with world-class specifications at One Prime residential part, an exclusive community hub by Revera Developers LLP. Strategically located at Newtown Action Area 1, find a large selection of commercial facilities just a few steps away from your abode to add the quintessential touch of elegance and convenience to your lifestyle unlike anywhere else."
    ]$json$::jsonb,

    -- Overview cards use the same icon keys/assets already used by recent pages.
    $json$[
      {"label":"2,3 BHK Apartments","desc":"Premium residential apartments.","icon":"size"},
      {"label":"Ample Amenities","desc":"State-of-the-art amenities for daily comfort.","icon":"amenities"},
      {"label":"Prime Location","desc":"Newtown Action Area 1, Kolkata.","icon":"location"},
      {"label":"Commercial & Residential","desc":"Mixed-use convenience around your home.","icon":"infrastructure"}
    ]$json$::jsonb,

    -- Amenity icon keys reuse the existing project subpage SVG icon system.
    $json$[
      {"name":"AC Lobby with High Speed Lifts","icon":"lobby"},
      {"name":"Open Gym with Terrace","icon":"gym"},
      {"name":"Meditation / Yoga Deck","icon":"yoga"},
      {"name":"Open / Mechanical Car Park","icon":"parking"},
      {"name":"Basement Car Park","icon":"parking"},
      {"name":"Air Conditioned Apartments","icon":"home"},
      {"name":"Modular Kitchen","icon":"kitchen"},
      {"name":"Premium Tiles","icon":"tiles"},
      {"name":"Modular Switches","icon":"switches"},
      {"name":"Concealed Copper Wiring","icon":"electrical"}
    ]$json$::jsonb,

    -- Custom metadata consumed by OnePrimeResidentialPage.
    $json$[
      {"title":"__hero_mobile_url__","desc":"/projects/one-prime-residential/card.webp"},
      {"title":"__floor_plans__","desc":"[{\"title\":\"10th Floor Plan\",\"desc\":\"/projects/one-prime-residential/floor-plan-10th.webp\",\"config\":\"3.5 BHK\"},{\"title\":\"11th Floor Plan\",\"desc\":\"/projects/one-prime-residential/floor-plan-11th.webp\",\"config\":\"3.5 BHK\"},{\"title\":\"12th Floor Plan\",\"desc\":\"/projects/one-prime-residential/floor-plan-12th.webp\",\"config\":\"3.5 BHK\"},{\"title\":\"13th Floor Plan\",\"desc\":\"/projects/one-prime-residential/floor-plan-13th.webp\",\"config\":\"3.5 BHK\"}]"},
      {"title":"__video_section__","desc":"{\"enabled\":true,\"videos\":[{\"title\":\"Project Walkthrough\",\"videoUrl\":\"https://youtu.be/7ofcd0vT3mw?si=rt4CLfOuXuTZLiy7\",\"thumbnailUrl\":\"\"},{\"title\":\"Construction Walkthrough\",\"videoUrl\":\"https://youtu.be/UFmTMObIIbg?si=c_f5qHcwfJGREMpm\",\"thumbnailUrl\":\"\"}]}"},
      {"title":"__construction_updates__","desc":"[{\"src\":\"/projects/one-prime-residential/construction-2026-04.webp\",\"alt\":\"One Prime construction update April 2026\"},{\"src\":\"/projects/one-prime-residential/construction-2024-07.webp\",\"alt\":\"One Prime construction update July 2024\"},{\"src\":\"/projects/one-prime-residential/construction-1.webp\",\"alt\":\"One Prime construction update 1\"},{\"src\":\"/projects/one-prime-residential/construction-2.webp\",\"alt\":\"One Prime construction update 2\"},{\"src\":\"/projects/one-prime-residential/construction-3.webp\",\"alt\":\"One Prime construction update 3\"},{\"src\":\"/projects/one-prime-residential/construction-4.webp\",\"alt\":\"One Prime construction update 4\"},{\"src\":\"/projects/one-prime-residential/construction-5.webp\",\"alt\":\"One Prime construction update 5\"},{\"src\":\"/projects/one-prime-residential/construction-6.webp\",\"alt\":\"One Prime construction update 6\"},{\"src\":\"/projects/one-prime-residential/construction-7.webp\",\"alt\":\"One Prime construction update 7\"},{\"src\":\"/projects/one-prime-residential/construction-2022-11.webp\",\"alt\":\"One Prime construction update November 2022\"},{\"src\":\"/projects/one-prime-residential/construction-op-12.webp\",\"alt\":\"One Prime construction update OP 12\"},{\"src\":\"/projects/one-prime-residential/construction-op-17.webp\",\"alt\":\"One Prime construction update OP 17\"},{\"src\":\"/projects/one-prime-residential/construction-op-19.webp\",\"alt\":\"One Prime construction update OP 19\"}]"}
    ]$json$::jsonb,

    '/projects/one-prime-residential/location-map.webp',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58943.32244774187!2d88.39105543124995!3d22.580687100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027515da72333d%3A0xe9a61d7d963987a2!2sONE%20PRIME!5e0!3m2!1sen!2sin!4v1691433745244!5m2!1sen!2sin',
    $json$[]$json$::jsonb,
    '',

    $json$[
      {"src":"/projects/one-prime-residential/gallery-1.webp","alt":"One Prime Residential gallery image 1"},
      {"src":"/projects/one-prime-residential/gallery-2.webp","alt":"One Prime Residential gallery image 2"},
      {"src":"/projects/one-prime-residential/gallery-3.webp","alt":"One Prime Residential gallery image 3"},
      {"src":"/projects/one-prime-residential/gallery-4.webp","alt":"One Prime Residential gallery image 4"},
      {"src":"/projects/one-prime-residential/gallery-5.webp","alt":"One Prime Residential gallery image 5"}
    ]$json$::jsonb,

    '/projects/one-prime-residential/brochure.pdf',
    'One Prime Residential - Ruchi Realty',
    'Experience luxury living at One Prime Residential, offering exquisite 2, 3 BHK apartments with world-class amenities in Newtown Action Area 1.',
    true
  );
END $$;

COMMIT;
