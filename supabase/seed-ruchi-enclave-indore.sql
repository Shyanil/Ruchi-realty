-- Ruchi Enclave Indore: minimal rerunnable seed for projects/project_subpages.
-- Business status remains VERIFY; Upcoming is retained from the existing card so it stays editable in the admin status dropdown.
BEGIN;

DO $$
DECLARE v_project_id uuid;
BEGIN
  -- Reuse only the existing Ruchi Enclave project in Indore.
  SELECT id INTO v_project_id FROM public.projects
  WHERE title ILIKE 'Ruchi Enclave%' AND location ILIKE '%Indore%'
  ORDER BY created_at ASC LIMIT 1;

  -- Base card shared by the homepage and project listing.
  IF v_project_id IS NULL THEN
    INSERT INTO public.projects (
      id,title,tag,image_url,location,description,type,status,featured,sort_order,feature_order
    ) VALUES (
      gen_random_uuid(),'Ruchi Enclave','Residential project in Indore',
      '/projects/ruchi-enclave-indore/hero.webp','Indore',
      'Ruchi Enclave is a residential project in Indore. Full project details can be updated from the admin panel.',
      'Township','Upcoming',true,19,19
    ) RETURNING id INTO v_project_id;
  ELSE
    UPDATE public.projects SET
      title='Ruchi Enclave',tag='Residential project in Indore',
      image_url='/projects/ruchi-enclave-indore/hero.webp',location='Indore',
      description='Ruchi Enclave is a residential project in Indore. Full project details can be updated from the admin panel.',
      type='Township',status='Upcoming',featured=true,sort_order=19,feature_order=19
    WHERE id=v_project_id;
  END IF;

  -- Replace only this project's detail shell. Every optional content section starts empty and remains admin-editable.
  DELETE FROM public.project_subpages WHERE project_id=v_project_id;

  INSERT INTO public.project_subpages (
    project_id,hero_title,hero_tagline,hero_logo,hero_bg,overview_paragraphs,
    overview_highlights,amenities,specifications,location_image,location_map_embed,
    location_destinations,walkthrough_video_id,gallery_images,brochure_url,
    meta_title,meta_description,is_published
  ) VALUES (
    v_project_id,
    'Ruchi Enclave',
    'Residential project in Indore',
    '',
    '/projects/ruchi-enclave-indore/hero.webp',
    jsonb_build_array(),
    jsonb_build_array(),
    jsonb_build_array(),
    jsonb_build_array(
      jsonb_build_object('title','__floor_plans__','desc','[]'),
      jsonb_build_object('title','__video_section__','desc',jsonb_build_object('enabled',false,'videoUrl','','thumbnailUrl','')::text)
    ),
    '',
    '',
    jsonb_build_array(),
    '',
    jsonb_build_array(),
    '',
    '',
    '',
    true
  );
END $$;

COMMIT;
