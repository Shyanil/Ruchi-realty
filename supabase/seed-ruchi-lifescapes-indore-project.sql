-- Ruchi Lifescapes Indore: rerunnable seed for the current projects/project_subpages schema.
-- The application derives the public slug ruchi-lifescapes-indore-project from title + location.
BEGIN;

DO $$
DECLARE v_project_id uuid;
BEGIN
  -- Reuse only the existing Indore Lifescapes card; never match the Bhopal project.
  SELECT id INTO v_project_id FROM public.projects
  WHERE title ILIKE 'Ruchi Lifescapes%' AND location ILIKE '%Indore%'
  ORDER BY created_at ASC LIMIT 1;

  -- Main card shared by the homepage and project listing.
  IF v_project_id IS NULL THEN
    INSERT INTO public.projects (
      id,title,tag,image_url,location,description,type,status,featured,sort_order,feature_order
    ) VALUES (
      gen_random_uuid(),'Ruchi Lifescapes','Big on Life',
      '/projects/ruchi-lifescapes-indore-project/hero.webp','Jhalariya, Indore',
      'A premium township offering villa plots from 1400 to 10000 sqft, ample amenities, lush green surroundings, and excellent connectivity near Phoenix Citadel and the Indore Bypass.',
      'Township','Ready to Move',true,10,10
    ) RETURNING id INTO v_project_id;
  ELSE
    UPDATE public.projects SET
      title='Ruchi Lifescapes',tag='Big on Life',
      image_url='/projects/ruchi-lifescapes-indore-project/hero.webp',
      location='Jhalariya, Indore',
      description='A premium township offering villa plots from 1400 to 10000 sqft, ample amenities, lush green surroundings, and excellent connectivity near Phoenix Citadel and the Indore Bypass.',
      type='Township',status='Ready to Move',featured=true,sort_order=10,feature_order=10
    WHERE id=v_project_id;
  END IF;

  -- Clean up only this project's 1:1 child row before reseeding its JSON sections.
  DELETE FROM public.project_subpages WHERE project_id=v_project_id;

  -- Detail content follows the shared React project-page renderer and admin editor format.
  INSERT INTO public.project_subpages (
    project_id,hero_title,hero_tagline,hero_logo,hero_bg,overview_paragraphs,
    overview_highlights,amenities,specifications,location_image,location_map_embed,
    location_destinations,walkthrough_video_id,gallery_images,brochure_url,
    meta_title,meta_description,is_published
  ) VALUES (
    v_project_id,'Ruchi Lifescapes','Ruchi Lifescapes Indore - Big on Life',
    '/projects/ruchi-lifescapes-indore-project/project-logo.webp',
    '/projects/ruchi-lifescapes-indore-project/hero.webp',
    $json$["The big on life now gets bigger.","A premium township, Ruchi Lifescapes Indore, is nestled in the vast expanse of lush green surroundings, featuring the finest living options and top-of-the-line amenities. Thoughtfully designed elegant living spaces comprise Villas, Row Houses, and luxurious plots. Conveniently located near Phoenix Citadel and well connected to the Nagpur Highway, it is situated at Jhalaria, which is fast emerging as the choicest living destination of the city. Life at Ruchi Lifescapes Indore has emerged as a convenient, safe, and splendid location for your home.","With RUCHI LIFESCAPES, we now unveil a glorious mix of splendor and articulation. Here, you will find exclusive plots for the privileged few, so that you can design according to your specific needs. Step into this exquisite haven of luxuries to discover yourself in a completely different world, offering an unparalleled living experience."]$json$::jsonb,
    $json$[{"label":"Amenities","desc":"Ample Amenities","icon":"amenities"},{"label":"Type","desc":"Premium Villa Plots","icon":"infrastructure"},{"label":"Plot Size","desc":"1400 - 10000 sqft","icon":"size"},{"label":"Location","desc":"Jhalariya, Indore","icon":"location"}]$json$::jsonb,
    $json$[{"name":"Garden","icon":"garden"},{"name":"Row House / Villa","icon":"hall"},{"name":"Kids Play Zone","icon":"playground"},{"name":"Basketball Court / Tennis Court","icon":"tennis"}]$json$::jsonb,
    jsonb_build_array(
      jsonb_build_object('title','Project Details','desc','VISHAL RESORTS & HOTELS PVT. LTD. Behind Shishukunj School, Off Indore Bypass, Jhalaria Village, Indore (M.P.) - India. Registration ID: P-IND-22-3276. Phone: +91 731 401 8009. Email: emarketing@rrhlrealty.com'),
      jsonb_build_object('title','__hero_mobile_url__','desc','/projects/ruchi-lifescapes-indore-project/hero-mobile.webp'),
      jsonb_build_object('title','__company_logo_url__','desc','/projects/ruchi-lifescapes-indore-project/company-logo.webp'),
      jsonb_build_object('title','__floor_plans__','desc','[{"title":"Layout Plan","desc":"/projects/ruchi-lifescapes-indore-project/layout-plan.webp"}]'),
      jsonb_build_object('title','__video_section__','desc','{"enabled":false,"videoUrl":"","thumbnailUrl":""}')
    ),
    '/projects/ruchi-lifescapes-indore-project/location-map.webp','',
    jsonb_build_array(
      jsonb_build_object('name','Hotel','dist','2 km'),
      jsonb_build_object('name','Hospital','dist','3 km'),
      jsonb_build_object('name','School','dist','1 km'),
      jsonb_build_object('name','Mall','dist','2 km'),
      jsonb_build_object('name','Airport','dist','22 km'),
      jsonb_build_object('name','Railway Station','dist','9 km')
    ),
    '',
    jsonb_build_array(
      jsonb_build_object('src','/projects/ruchi-lifescapes-indore-project/gallery-1.webp','alt','Ruchi Lifescapes Indore gallery image 1'),
      jsonb_build_object('src','/projects/ruchi-lifescapes-indore-project/gallery-2.webp','alt','Ruchi Lifescapes Indore gallery image 2'),
      jsonb_build_object('src','/projects/ruchi-lifescapes-indore-project/gallery-3.webp','alt','Ruchi Lifescapes Indore gallery image 3'),
      jsonb_build_object('src','/projects/ruchi-lifescapes-indore-project/gallery-4.webp','alt','Ruchi Lifescapes Indore gallery image 4'),
      jsonb_build_object('src','/projects/ruchi-lifescapes-indore-project/gallery-5.webp','alt','Ruchi Lifescapes Indore gallery image 5'),
      jsonb_build_object('src','/projects/ruchi-lifescapes-indore-project/gallery-6.webp','alt','Ruchi Lifescapes Indore gallery image 6')
    ),
    '',
    'Ruchi Lifescapes Indore - Big on Life | Ruchi Realty',
    'Ruchi Lifescapes Indore is a premium township at Jhalariya, Indore, offering premium villa plots from 1400 to 10000 sqft, ample amenities, lush green surroundings, and excellent connectivity near Phoenix Citadel and the Indore Bypass.',true
  );
END $$;
COMMIT;
