-- One Victoria New Town: rerunnable seed for the existing projects/project_subpages schema.
-- The public slug is derived by js/backend-client.jsx from title + Kolkata location.
BEGIN;

DO $$
DECLARE v_project_id uuid;
v_destinations jsonb := $json$[
  {"name":"Novotel Hotel","dist":"0.8 km"},{"name":"Metro Station","dist":"0.2 km"},
  {"name":"Amity University","dist":"4.7 km"},{"name":"Newtown Bus Stop","dist":"0.7 km"},
  {"name":"Eco Park","dist":"3.6 km"},{"name":"Axis Mall","dist":"0.1 km"},
  {"name":"Airport","dist":"12 km"},{"name":"Tata Medical Center","dist":"2.8 km"}
]$json$::jsonb;
v_gallery jsonb := $json$[
  {"src":"/projects/one-victoria-new-town/gallery/gallery-1.webp","alt":"One Victoria gallery image 1","category":"Gallery"},
  {"src":"/projects/one-victoria-new-town/gallery/gallery-2.webp","alt":"One Victoria gallery image 2","category":"Gallery"},
  {"src":"/projects/one-victoria-new-town/gallery/gallery-3.webp","alt":"One Victoria gallery image 3","category":"Gallery"},
  {"src":"/projects/one-victoria-new-town/gallery/gallery-4.webp","alt":"One Victoria gallery image 4","category":"Gallery"},
  {"src":"/projects/one-victoria-new-town/gallery/gallery-5.webp","alt":"One Victoria gallery image 5","category":"Gallery"},
  {"src":"/projects/one-victoria-new-town/gallery/gallery-6.webp","alt":"One Victoria gallery image 6","category":"Gallery"},
  {"src":"/projects/one-victoria-new-town/gallery/construction-1.jpeg","alt":"One Victoria construction update 1","category":"Construction"},
  {"src":"/projects/one-victoria-new-town/gallery/construction-2.jpeg","alt":"One Victoria construction update 2","category":"Construction"},
  {"src":"/projects/one-victoria-new-town/gallery/construction-3.jpeg","alt":"One Victoria construction update 3","category":"Construction"}
]$json$::jsonb;
v_specs jsonb := jsonb_build_array(
  jsonb_build_object('title','Location Context','desc','At One Victoria, the best of East Kolkata is outside your doorstep. Whether you travel by metro, cab or flight, commuting from one place to another will be simplified beyond your expectations.'),
  jsonb_build_object('title','Project Details','desc','Residential + Retail / Apartment Complex. RERA: WBRERA/P/NOR/2024/001080. Phone: 033 6902 9144. Email: info@ruchirealty.com'),
  jsonb_build_object('title','__hero_mobile_url__','desc','/projects/one-victoria-new-town/hero-mobile.webp'),
  jsonb_build_object('title','__company_logo_url__','desc','/projects/one-victoria-new-town/company-logo.png'),
  jsonb_build_object('title','__floor_plans__','desc',jsonb_build_array(
    jsonb_build_object('title','Typical Floor Plan','desc','/projects/one-victoria-new-town/plans/typical-floor-plan.jpg'),
    jsonb_build_object('title','Star Gazing Deck','desc','/projects/one-victoria-new-town/plans/star-gazing-deck.jpg'),
    jsonb_build_object('title','Podium Plan','desc','/projects/one-victoria-new-town/plans/podium-plan.jpg')
  )::text),
  jsonb_build_object('title','__video_section__','desc',jsonb_build_object('enabled',false,'videoUrl','','thumbnailUrl','')::text)
);
v_amenities jsonb := $json$[
  {"name":"Community Hall with Spill Over Area","icon":"hall"},
  {"name":"Party Cabana","icon":"hall"},
  {"name":"Swimming Pool","icon":"pool"},
  {"name":"Jacuzzi","icon":"spa"},
  {"name":"Forest Meditation Cabana","icon":"meditation"},
  {"name":"Pool Loungers","icon":"pool"},
  {"name":"Poolside Cabanas","icon":"pool"},
  {"name":"Covered Walkway Under Pergola","icon":"garden"},
  {"name":"Yoga Lawn","icon":"yoga"},
  {"name":"State-of-the-Art Multi Gym","icon":"gym"},
  {"name":"Stepped Seating","icon":"hall"},
  {"name":"Action Station","icon":"games"},
  {"name":"Kids Play Area","icon":"playground"},
  {"name":"Open Badminton Court","icon":"badminton"},
  {"name":"Amphitheatre","icon":"hall"},
  {"name":"Star Gazing Deck","icon":"lounge"}
]$json$::jsonb;
v_overview jsonb := $json$[
  "Amidst the fast-paced streets of Newtown, ONE VICTORIA, a retail & apartment complex stands as a tranquil haven, seamlessly blending luxury residences with cutting-edge retail spaces. Located in the thriving Action Area-1, Newtown, relish in the perfect blend of convenience with excellent connectivity.",
  "Choose more than a home or workplace; choose a lifestyle. With Newtown's vibrant community, cultural richness, and futuristic urban planning, One Victoria emerges as the premier address for those seeking the best in both living and business."
]$json$::jsonb;
v_highlights jsonb := $json$[
  {"label":"Possession","desc":"2029","icon":"infrastructure"},
  {"label":"Location","desc":"Action Area 1, New Town, Kolkata","icon":"location"},
  {"label":"Flats Type","desc":"3/4 BHK 3 Cr.* onwards","icon":"size"},
  {"label":"Near To","desc":"Next to Novotel, beside Axis Mall","icon":"amenities"}
]$json$::jsonb;
BEGIN
  -- Reuse only the existing One Victoria card in Kolkata.
  SELECT id INTO v_project_id FROM public.projects
  WHERE title ILIKE 'One Victoria%' AND location ILIKE '%Kolkata%'
  ORDER BY created_at ASC LIMIT 1;

  -- Main card shared by the homepage and project listing.
  IF v_project_id IS NULL THEN
    INSERT INTO public.projects (
      id,title,tag,image_url,location,description,type,status,featured,sort_order,feature_order
    ) VALUES (
      gen_random_uuid(),'One Victoria','3/4 BHK apartments from 3 Cr.* onwards',
      '/projects/one-victoria-new-town/hero.webp','Action Area 1, New Town, Kolkata',
      'One Victoria is an ongoing residential and retail development in Action Area 1, New Town, Kolkata, offering 3/4 BHK apartments from 3 Cr.* onwards, located next to Novotel and beside Axis Mall.',
      'Residential','Ongoing',true,1,1
    ) RETURNING id INTO v_project_id;
  ELSE
    UPDATE public.projects SET
      title='One Victoria',tag='3/4 BHK apartments from 3 Cr.* onwards',
      image_url='/projects/one-victoria-new-town/hero.webp',
      location='Action Area 1, New Town, Kolkata',
      description='One Victoria is an ongoing residential and retail development in Action Area 1, New Town, Kolkata, offering 3/4 BHK apartments from 3 Cr.* onwards, located next to Novotel and beside Axis Mall.',
      type='Residential',status='Ongoing',featured=true,sort_order=1,feature_order=1
    WHERE id=v_project_id;
  END IF;

  -- Clean and reseed only One Victoria's 1:1 detail row.
  DELETE FROM public.project_subpages WHERE project_id=v_project_id;

  -- All section shapes match the current React renderer and admin editor.
  INSERT INTO public.project_subpages (
    project_id,hero_title,hero_tagline,hero_logo,hero_bg,overview_paragraphs,
    overview_highlights,amenities,specifications,location_image,location_map_embed,
    location_destinations,walkthrough_video_id,gallery_images,brochure_url,
    meta_title,meta_description,is_published
  ) VALUES (
    v_project_id,'One Victoria','Residential & Retail / Apartment Complex',
    '/projects/one-victoria-new-town/project-logo.png','/projects/one-victoria-new-town/hero.webp',
    v_overview,v_highlights,v_amenities,v_specs,
    '/projects/one-victoria-new-town/location.webp','',v_destinations,'',v_gallery,'',
    'One Victoria New Town - Ruchi Realty',
    'One Victoria is an ongoing residential and retail development in Action Area 1, New Town, Kolkata, offering 3/4 BHK apartments from 3 Cr.* onwards, located next to Novotel and beside Axis Mall.',
    true
  );
END $$;

COMMIT;
