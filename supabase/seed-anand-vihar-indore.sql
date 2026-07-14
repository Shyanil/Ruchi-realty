-- Anand Vihar Indore: rerunnable seed for the current projects/project_subpages schema.
-- The application derives the public slug anand-vihar-indore from title + location.
BEGIN;

DO $$
DECLARE v_project_id uuid;
BEGIN
  -- Reuse only the existing Anand Vihar card in Indore.
  SELECT id INTO v_project_id FROM public.projects
  WHERE title ILIKE 'Anand Vihar%' AND location ILIKE '%Indore%'
  ORDER BY created_at ASC LIMIT 1;

  -- Main card shared by the homepage and project listing.
  IF v_project_id IS NULL THEN
    INSERT INTO public.projects (
      id,title,tag,image_url,location,description,type,status,featured,sort_order,feature_order
    ) VALUES (
      gen_random_uuid(),'Anand Vihar','Premium Plots in Indore',
      '/projects/anand-vihar-indore/hero.webp','Morod, Indore',
      'Premium residential plots with world-class amenities, realistic offerings, quality living solutions, and a convenient location near Country Club, Khandwa Road.',
      'Township','Ready to Move',true,12,12
    ) RETURNING id INTO v_project_id;
  ELSE
    UPDATE public.projects SET
      title='Anand Vihar',tag='Premium Plots in Indore',
      image_url='/projects/anand-vihar-indore/hero.webp',location='Morod, Indore',
      description='Premium residential plots with world-class amenities, realistic offerings, quality living solutions, and a convenient location near Country Club, Khandwa Road.',
      type='Township',status='Ready to Move',featured=true,sort_order=12,feature_order=12
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
    v_project_id,'Anand Vihar','Premium Plots in Indore',
    '/projects/anand-vihar-indore/project-logo.webp','/projects/anand-vihar-indore/hero.webp',
    jsonb_build_array(
      'Enriched with several years of real estate experience, we have deep insights into this sector and understand the pulse of the masses and classes, their requirements and expectations about affordable dwelling places with world-class amenities. We introduce Premium plots in Indore.',
      'We believe in providing complete Living Solutions. And we focus on quality, ambiance and affordability. We don’t over-promise and under-provide. We provide what we promise. Realistic offer is the hallmark of Anand Vihar.'
    ),
    jsonb_build_array(
      jsonb_build_object('label','Project Type','desc','Premium Plots in Indore','icon','size'),
      jsonb_build_object('label','Amenities','desc','World-Class Amenities','icon','amenities'),
      jsonb_build_object('label','Location','desc','Morod, Near Country Club, Khandwa Road','icon','location'),
      jsonb_build_object('label','Registration ID','desc','P-IND-17-1342','icon','infrastructure')
    ),
    jsonb_build_array(
      jsonb_build_object('name','Walking & Jogging Tracks','icon','jogging'),
      jsonb_build_object('name','Gated Community','icon','security'),
      jsonb_build_object('name','Swimming Pool','icon','pool'),
      jsonb_build_object('name','Integrated Club House','icon','hall'),
      jsonb_build_object('name','Children’s Play Zones','icon','playground'),
      jsonb_build_object('name','Indoor Games Room','icon','table'),
      jsonb_build_object('name','Beautiful Landscaping','icon','landscape'),
      jsonb_build_object('name','18 & 9 Meters Roads','icon','infrastructure')
    ),
    jsonb_build_array(
      jsonb_build_object('title','Project Details','desc','Morod, Near Country Club, Khandwa Road, Indore - 452020. Registration ID: P-IND-17-1342. Phone: +91 89292 25275. Email: info@anandviharindore.com'),
      jsonb_build_object('title','__hero_mobile_url__','desc','/projects/anand-vihar-indore/hero-mobile.webp'),
      jsonb_build_object('title','__video_section__','desc',jsonb_build_object('enabled',false,'videoUrl','','thumbnailUrl','')::text)
    ),
    '/projects/anand-vihar-indore/location-map.webp','',
    jsonb_build_array(
      jsonb_build_object('name','Nearest School','dist','Approx 3 Minutes'),
      jsonb_build_object('name','Nearest College','dist','Approx 10 Minutes'),
      jsonb_build_object('name','Nearest Hospital','dist','Approx 15 Minutes'),
      jsonb_build_object('name','Nearest Shopping Mall','dist','Approx 10 Minutes'),
      jsonb_build_object('name','Nearest Temple','dist','Approx 5 Minutes'),
      jsonb_build_object('name','Nearest Bus Stop','dist','Approx 2 Minutes'),
      jsonb_build_object('name','Railway Station','dist','Approx 30 Minutes'),
      jsonb_build_object('name','Hotels & Restaurants','dist','Approx 3 Minutes')
    ),
    '',
    jsonb_build_array(
      jsonb_build_object('src','/projects/anand-vihar-indore/gallery-1.webp','alt','Anand Vihar Indore gallery image 1'),
      jsonb_build_object('src','/projects/anand-vihar-indore/gallery-2.webp','alt','Anand Vihar Indore gallery image 2'),
      jsonb_build_object('src','/projects/anand-vihar-indore/gallery-3.webp','alt','Anand Vihar Indore gallery image 3'),
      jsonb_build_object('src','/projects/anand-vihar-indore/gallery-4.webp','alt','Anand Vihar Indore gallery image 4'),
      jsonb_build_object('src','/projects/anand-vihar-indore/gallery-5.webp','alt','Anand Vihar Indore gallery image 5'),
      jsonb_build_object('src','/projects/anand-vihar-indore/gallery-6.webp','alt','Anand Vihar Indore gallery image 6')
    ),
    '',
    'Anand Vihar Indore - Ruchi Realty',
    'Anand Vihar offers premium residential plots in Indore with world-class amenities, realistic offerings, quality living solutions, and a convenient location near Country Club, Khandwa Road.',
    true
  );
END $$;

COMMIT;
