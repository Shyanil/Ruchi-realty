-- Oscar Sanctuary Indore: minimal rerunnable seed for projects/project_subpages.
-- Business status remains VERIFY; Ongoing is retained from the existing primary project card and remains editable in admin.
BEGIN;

DO $$
DECLARE v_project_id uuid;
BEGIN
  -- Reuse only the existing Oscar Sanctuary project in Indore.
  SELECT id INTO v_project_id FROM public.projects
  WHERE title ILIKE 'Oscar Sanctuary%' AND location ILIKE '%Indore%'
  ORDER BY created_at ASC LIMIT 1;

  -- Base card shared by the homepage and project listing.
  IF v_project_id IS NULL THEN
    INSERT INTO public.projects (
      id,title,tag,image_url,location,description,type,status,featured,sort_order,feature_order
    ) VALUES (
      gen_random_uuid(),'Oscar Sanctuary','Residential project in Indore',
      '/projects/oscar-sanctuary-indore/hero.webp','Indore',
      'Oscar Sanctuary is a residential project in Indore. Full project details can be updated from the admin panel.',
      'Township','Ongoing',true,17,17
    ) RETURNING id INTO v_project_id;
  ELSE
    UPDATE public.projects SET
      title='Oscar Sanctuary',tag='Residential project in Indore',
      image_url='/projects/oscar-sanctuary-indore/hero.webp',location='Indore',
      description='Oscar Sanctuary is a residential project in Indore. Full project details can be updated from the admin panel.',
      type='Township',status='Ongoing',featured=true,sort_order=17,feature_order=17
    WHERE id=v_project_id;
  END IF;

  -- Replace only this project's detail shell. Optional sections start empty and remain admin-editable.
  DELETE FROM public.project_subpages WHERE project_id=v_project_id;

  INSERT INTO public.project_subpages (
    project_id,hero_title,hero_tagline,hero_logo,hero_bg,overview_paragraphs,
    overview_highlights,amenities,specifications,location_image,location_map_embed,
    location_destinations,walkthrough_video_id,gallery_images,brochure_url,
    meta_title,meta_description,is_published
  ) VALUES (
    v_project_id,
    'Oscar Sanctuary',
    'Residential project in Indore',
    '',
    '/projects/oscar-sanctuary-indore/hero.webp',
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
