-- Saatvik Vihar Indore: rerunnable seed for the current projects/project_subpages schema.
-- The application derives the public slug saatvik-vihar-indore from title + location.
BEGIN;

DO $$
DECLARE v_project_id uuid;
BEGIN
  -- Reuse only the existing Saatvik Vihar card in Indore.
  SELECT id INTO v_project_id FROM public.projects
  WHERE title ILIKE 'Saatvik Vihar%' AND location ILIKE '%Indore%'
  ORDER BY created_at ASC LIMIT 1;

  -- Main card shared by the homepage and project listing.
  IF v_project_id IS NULL THEN
    INSERT INTO public.projects (
      id,title,tag,image_url,location,description,type,status,featured,sort_order,feature_order
    ) VALUES (
      gen_random_uuid(),'Saatvik Vihar','Value Of Comfort And Quality',
      '/projects/saatvik-vihar-indore/hero.webp','Mangliya Sadak, Indore',
      'A premium township offering residential plots from 600 to 1800 sq.ft with ample amenities and a prime location opposite Sanchi Plant on A.B. Road.',
      'Township','Ready to Move',true,9,9
    ) RETURNING id INTO v_project_id;
  ELSE
    UPDATE public.projects SET
      title='Saatvik Vihar',tag='Value Of Comfort And Quality',
      image_url='/projects/saatvik-vihar-indore/hero.webp',location='Mangliya Sadak, Indore',
      description='A premium township offering residential plots from 600 to 1800 sq.ft with ample amenities and a prime location opposite Sanchi Plant on A.B. Road.',
      type='Township',status='Ready to Move',featured=true,sort_order=9,feature_order=9
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
    v_project_id,'Saatvik Vihar','Saatvik Vihar - Value Of Comfort And Quality',
    '/projects/saatvik-vihar-indore/project-logo.webp','/projects/saatvik-vihar-indore/hero.webp',
    jsonb_build_array(
      'Value Of Comfort And Quality',
      'Saatvik Vihar is synonymous with trust, backed by years of experience in the real estate industry. With a deep understanding of the sector, we grasp the needs and aspirations of both the masses and classes, particularly in terms of affordable housing solutions.',
      'Our philosophy revolves around offering comprehensive living solutions that prioritize quality, ambiance, and affordability. Unlike others, we refrain from making lofty promises that we cannot fulfill. Instead, we pride ourselves on delivering what we commit to, making realistic offers the hallmark of Saatvik Vihar.',
      'We are dedicated to maintaining a single standard of excellence across all our projects, emphasizing the quality and integrity of our developments. Saatvik Vihar represents our humble endeavor to provide housing solutions accessible to people from all walks of life, ensuring customer satisfaction remains our primary focus.',
      'In an overcrowded real estate market, Saatvik Vihar distinguishes itself by its unwavering commitment to serving the genuine needs of our clients. We are willing to go the extra mile to ensure the utmost satisfaction and well-being of our clientele, embodying the essence of “Saatvik” values in all our endeavors.'
    ),
    jsonb_build_array(
      jsonb_build_object('label','Amenities','desc','Ample Amenities','icon','amenities'),
      jsonb_build_object('label','Township','desc','Premium Township','icon','infrastructure'),
      jsonb_build_object('label','Plot Size','desc','600 to 1800 Sq.ft','icon','size'),
      jsonb_build_object('label','Location','desc','Prime Location','icon','location')
    ),
    jsonb_build_array(
      jsonb_build_object('name','Senior Citizen Garden','icon','garden'),
      jsonb_build_object('name','Gazebo','icon','hall'),
      jsonb_build_object('name','Club House','icon','hall'),
      jsonb_build_object('name','Gymnasium','icon','gym')
    ),
    jsonb_build_array(
      jsonb_build_object('title','Project Details','desc','Opposite Sanchi Plant, A.B. Road, Mangliya Sadak, Indore (M.P.). Registration ID: P-SWR-19-2266. Phone: +91 731 401 8009. Email: emarketing@rrhlrealty.com'),
      jsonb_build_object('title','__hero_mobile_url__','desc','/projects/saatvik-vihar-indore/hero-mobile.webp'),
      jsonb_build_object('title','__company_logo_url__','desc','/projects/saatvik-vihar-indore/company-logo.webp'),
      jsonb_build_object('title','__video_section__','desc',jsonb_build_object('enabled',true,'title','Saatvik Vihar Walkthrough','videoUrl','https://www.youtube.com/embed/_7QV5Mp_prE?controls=1&rel=0&autoplay=0&start=7','thumbnailUrl','/projects/saatvik-vihar-indore/hero.webp')::text)
    ),
    '/projects/saatvik-vihar-indore/location-map.webp','',
    jsonb_build_array(
      jsonb_build_object('name','Project Address','dist','Mangliya Sadak, Indore'),
      jsonb_build_object('name','Landmark','dist','Opposite Sanchi Plant'),
      jsonb_build_object('name','Registration ID','dist','P-SWR-19-2266')
    ),
    'https://www.youtube.com/watch?v=_7QV5Mp_prE&t=7s',
    jsonb_build_array(
      jsonb_build_object('src','/projects/saatvik-vihar-indore/gallery-1.webp','alt','Saatvik Vihar Indore gallery image 1'),
      jsonb_build_object('src','/projects/saatvik-vihar-indore/gallery-2.webp','alt','Saatvik Vihar Indore gallery image 2'),
      jsonb_build_object('src','/projects/saatvik-vihar-indore/gallery-3.webp','alt','Saatvik Vihar Indore gallery image 3'),
      jsonb_build_object('src','/projects/saatvik-vihar-indore/gallery-4.webp','alt','Saatvik Vihar Indore gallery image 4'),
      jsonb_build_object('src','/projects/saatvik-vihar-indore/gallery-5.webp','alt','Saatvik Vihar Indore gallery image 5'),
      jsonb_build_object('src','/projects/saatvik-vihar-indore/gallery-6.webp','alt','Saatvik Vihar Indore gallery image 6')
    ),
    '',
    'Saatvik Vihar Indore - Ruchi Realty',
    'Saatvik Vihar Indore is a premium township at Mangliya Sadak, Indore, offering residential plots from 600 to 1800 sq.ft with ample amenities, quality living solutions, and a prime location opposite Sanchi Plant on A.B. Road.',
    true
  );
END $$;

COMMIT;
