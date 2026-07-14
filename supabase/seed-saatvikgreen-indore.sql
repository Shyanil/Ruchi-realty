-- Saatvik Green Indore: rerunnable seed for the current projects/project_subpages schema.
-- The application derives the public slug saatvikgreen-indore from title + location.
BEGIN;

DO $$
DECLARE v_project_id uuid;
BEGIN
  -- Reuse only the existing Saatvik Green card in Indore.
  SELECT id INTO v_project_id FROM public.projects
  WHERE title ILIKE 'Saatvik Green%' AND location ILIKE '%Indore%'
  ORDER BY created_at ASC LIMIT 1;

  -- Main card shared by the homepage and project listing.
  IF v_project_id IS NULL THEN
    INSERT INTO public.projects (
      id,title,tag,image_url,location,description,type,status,featured,sort_order,feature_order
    ) VALUES (
      gen_random_uuid(),'Saatvik Green','Residential & Commercial Plots on Main Bypass Road',
      '/projects/saatvikgreen-indore/hero.webp','Rahukhedi, Mangliya, Indore',
      'A 28+ acre township near Manglia Toll Plaza offering residential and commercial plots from 850 to 3500 sqft with strong connectivity and planned facilities.',
      'Township','Ready to Move',true,11,11
    ) RETURNING id INTO v_project_id;
  ELSE
    UPDATE public.projects SET
      title='Saatvik Green',tag='Residential & Commercial Plots on Main Bypass Road',
      image_url='/projects/saatvikgreen-indore/hero.webp',location='Rahukhedi, Mangliya, Indore',
      description='A 28+ acre township near Manglia Toll Plaza offering residential and commercial plots from 850 to 3500 sqft with strong connectivity and planned facilities.',
      type='Township',status='Ready to Move',featured=true,sort_order=11,feature_order=11
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
    v_project_id,'Saatvik Green','Saatvik Green Indore',
    '/projects/saatvikgreen-indore/project-logo.webp','/projects/saatvikgreen-indore/hero.webp',
    jsonb_build_array(
      'Saatvik Green Indore is an over 28 acre township which is well located on the Indore-Dewas By-pass, near Manglia toll plaza, Indore, close to all educational, recreational and shopping hubs.',
      'Saatvik Green, Indore is designed to provide all necessary facilities within the township for the advantage of the residents, be it dedicated plots for schools, shopping area with provision of adequate water supply, electrification, well lit, wide metaled roads etc.',
      'Saatvik Green will offer an opportunity to live in serene surroundings with matchless connectivity with landmarks of city.'
    ),
    jsonb_build_array(
      jsonb_build_object('label','Plot Type','desc','Residential & Commercial','icon','infrastructure'),
      jsonb_build_object('label','Location','desc','Rahukhedi, Mangliya, Indore','icon','location'),
      jsonb_build_object('label','Plot Size','desc','850 to 3500 sqft','icon','size'),
      jsonb_build_object('label','Near To','desc','At Main Bypass Road','icon','amenities')
    ),
    jsonb_build_array(),
    jsonb_build_array(
      jsonb_build_object('title','Project Details','desc','Rahukhedi, Mangliya, Indore-Dewas Bypass, near Manglia Toll Plaza, Indore. Registration IDs: P-SWR-24-4662 and P-SWR-24-4859. Phone: +91 89292 25275. Email: info@ruchirealty.com'),
      jsonb_build_object('title','__hero_mobile_url__','desc','/projects/saatvikgreen-indore/hero-mobile.webp'),
      jsonb_build_object('title','__company_logo_url__','desc','/projects/saatvikgreen-indore/company-logo.webp'),
      jsonb_build_object('title','__video_section__','desc',jsonb_build_object('enabled',false,'videoUrl','','thumbnailUrl','')::text)
    ),
    '',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4999.65613007766!2d75.93874079974611!3d22.83386000982388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39631db995c1582f%3A0x1c1ff37db299b50a!2sSaatvik%20Green!5e1!3m2!1sen!2sin!4v1750414936082!5m2!1sen!2sin',
    jsonb_build_array(
      jsonb_build_object('name','Proposed Shopping, School & Medical','dist','Land facilities'),
      jsonb_build_object('name','Well Laid Out Parks','dist','Within township'),
      jsonb_build_object('name','Sector-wise Township','dist','Planned development'),
      jsonb_build_object('name','Wide Metalled Roads','dist','Well lit'),
      jsonb_build_object('name','Indore Railway Station','dist','20 km'),
      jsonb_build_object('name','Bombay Hospital','dist','12 km'),
      jsonb_build_object('name','Radisson Hotel','dist','11 km'),
      jsonb_build_object('name','Acropolis Institute & Bhawan Public School','dist','Nearby')
    ),
    '',
    jsonb_build_array(
      jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-1.webp','alt','Saatvik Green Indore gallery image 1'),
      jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-2.webp','alt','Saatvik Green Indore gallery image 2'),
      jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-3.webp','alt','Saatvik Green Indore gallery image 3'),
      jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-4.webp','alt','Saatvik Green Indore gallery image 4'),
      jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-5.webp','alt','Saatvik Green Indore gallery image 5'),
      jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-6.webp','alt','Saatvik Green Indore gallery image 6'),
      jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-7.webp','alt','Saatvik Green Indore gallery image 7'),
      jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-8.webp','alt','Saatvik Green Indore gallery image 8'),
      jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-9.webp','alt','Saatvik Green Indore gallery image 9'),
      jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-10.webp','alt','Saatvik Green Indore gallery image 10'),
      jsonb_build_object('src','/projects/saatvikgreen-indore/gallery-11.webp','alt','Saatvik Green Indore gallery image 11')
    ),
    '',
    'Saatvik Green Indore - Ruchi Realty',
    'Saatvik Green Indore is a 28+ acre township on the Indore-Dewas Bypass near Manglia Toll Plaza, offering residential and commercial plots from 850 to 3500 sqft with strong connectivity, township facilities, wide roads, and proposed shopping, school and medical land facilities.',
    true
  );
END $$;

COMMIT;
