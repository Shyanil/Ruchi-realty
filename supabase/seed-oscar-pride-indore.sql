-- Oscar Pride Indore: rerunnable seed for current projects/project_subpages schema.
BEGIN;
DO $$
DECLARE v_project_id uuid;
BEGIN
  -- Reuse the existing Oscar Pride card when present.
  SELECT id INTO v_project_id FROM public.projects
  WHERE title ILIKE 'Oscar Pride%' AND location ILIKE '%Indore%'
  ORDER BY created_at ASC LIMIT 1;

  -- Main card used by the homepage and projects listing.
  IF v_project_id IS NULL THEN
    INSERT INTO public.projects (id,title,tag,image_url,location,description,type,status,featured,sort_order,feature_order)
    VALUES (gen_random_uuid(),'Oscar Pride','A Promise of Luxury Living','/projects/oscar-pride-indore/hero.jpg','Indore, Madhya Pradesh','A premium plotting township near Kanadia, Indore, with 1250 to 3200 sqft plots, ample amenities, excellent connectivity, and a secure lifestyle across 8 acres.','Township','Ready to Move',true,8,8)
    RETURNING id INTO v_project_id;
  ELSE
    UPDATE public.projects SET title='Oscar Pride',tag='A Promise of Luxury Living',image_url='/projects/oscar-pride-indore/hero.jpg',location='Indore, Madhya Pradesh',description='A premium plotting township near Kanadia, Indore, with 1250 to 3200 sqft plots, ample amenities, excellent connectivity, and a secure lifestyle across 8 acres.',type='Township',status='Ready to Move',featured=true,sort_order=8,feature_order=8 WHERE id=v_project_id;
  END IF;

  -- Delete only this project's 1:1 detail row, then recreate its JSON sections.
  DELETE FROM public.project_subpages WHERE project_id=v_project_id;
  INSERT INTO public.project_subpages (
    project_id,hero_title,hero_tagline,hero_logo,hero_bg,overview_paragraphs,
    overview_highlights,amenities,specifications,location_image,location_map_embed,
    location_destinations,walkthrough_video_id,gallery_images,brochure_url,
    meta_title,meta_description,is_published
  ) VALUES (
    v_project_id,'Oscar Pride','Oscar Pride - A Promise of Luxury Living','/projects/oscar-pride-indore/logo.png','/projects/oscar-pride-indore/hero.jpg',
    $json$["With Oscar Pride, you are not just buying land but an opportunity to enrich your future. Oscar Pride offers an array of benefits, has excellent connectivity, is a perfect choice for a luxurious lifestyle and is an investment that keeps growing. Either way, Oscar Pride is a landmark that will redefine you.","Located on Kanadia Main Road, Bypass, Oscar Pride is a unique plotting township sprawling over 8 acres area. With multiple plot sizes, it proves to be an excellent choice for those who aspire to live a zesty and yet secure lifestyle."]$json$::jsonb,
    $json$[{"label":"Amenities","desc":"Ample Amenities","icon":"amenities"},{"label":"Township","desc":"Premium Township","icon":"infrastructure"},{"label":"Plot Size","desc":"1250 to 3200 sqft","icon":"size"},{"label":"Near To","desc":"Near Kanadia, Indore","icon":"location"}]$json$::jsonb,
    $json$[{"name":"Temple","icon":"temple"},{"name":"Gymnasium","icon":"gym"},{"name":"Jogging Track","icon":"jogging"},{"name":"Kids Play Area","icon":"playground"},{"name":"Garden 1","icon":"garden"},{"name":"Garden 2","icon":"garden"},{"name":"Barbeque","icon":"club"}]$json$::jsonb,
    $json$[{"title":"Project Details","desc":"Beside Ekayana School, Bypass Road, Near Kanadia, Indore. Registration ID: P-IND-22-3276. Phone: +91 89292 25275. Email: emarketing@rrhlrealty.com"},{"title":"__floor_plans__","desc":"[{\"title\":\"Layout Plan\",\"desc\":\"/projects/oscar-pride-indore/plans-plan.webp\"}]"},{"title":"__video_section__","desc":"{\"enabled\":false,\"videoUrl\":\"\",\"thumbnailUrl\":\"\"}"}]$json$::jsonb,
    '/projects/oscar-pride-indore/loc-1.webp','',
    $json$[{"name":"Sherringwood World School","dist":"4 km"},{"name":"Devi Ahilyabai Holkar Airport","dist":"17 km"},{"name":"PHOENIX HOSPITAL","dist":"4 km"},{"name":"Indore Railway Station","dist":"8 km"},{"name":"Ahilya Udhyan Ganesh Mandir","dist":"2 km"},{"name":"D-Mart","dist":"1 km"}]$json$::jsonb,
    '',
    $json$[{"src":"/projects/oscar-pride-indore/gallery-g-1.webp","alt":"Oscar Pride gallery image 1"},{"src":"/projects/oscar-pride-indore/gallery-g-2.webp","alt":"Oscar Pride gallery image 2"},{"src":"/projects/oscar-pride-indore/gallery-g-3.webp","alt":"Oscar Pride gallery image 3"},{"src":"/projects/oscar-pride-indore/gallery-g-4.webp","alt":"Oscar Pride gallery image 4"},{"src":"/projects/oscar-pride-indore/gallery-g-5.webp","alt":"Oscar Pride gallery image 5"},{"src":"/projects/oscar-pride-indore/gallery-g-6.webp","alt":"Oscar Pride gallery image 6"},{"src":"/projects/oscar-pride-indore/gallery-g-7.webp","alt":"Oscar Pride gallery image 7"}]$json$::jsonb,
    '', 'Oscar Pride Indore - Ruchi Realty','Oscar Pride is a premium plotting township near Kanadia, Indore, offering 1250 to 3200 sqft plots, ample amenities, excellent connectivity, and a secure lifestyle across an 8-acre township.',true
  );
END $$;
COMMIT;
