-- One Victoria: editable project-detail content, specification images, and optional walkthrough.
-- Run once in the Supabase SQL Editor after backend/sql/project_subpages.sql.
-- Safe to re-run: the project_subpages row is upserted by project_id.

do $$
declare
  v_project_id uuid;
begin
  select id into v_project_id
  from public.projects
  where title ilike '%One Victoria%'
  limit 1;

  if v_project_id is null then
    insert into public.projects (
      id, title, tag, image_url, location, description,
      type, status, featured, sort_order, feature_order
    ) values (
      gen_random_uuid(),
      'One Victoria',
      'Residential & Retail / Apartment Complex',
      '/projects/one-victoria-new-town/hero.webp',
      'Action Area 1, New Town, Kolkata',
      'One Victoria is an ongoing residential and retail development in Action Area 1, New Town, Kolkata.',
      'Residential',
      'Ongoing',
      true,
      1,
      1
    ) returning id into v_project_id;
  end if;

  insert into public.project_subpages (
  project_id, hero_title, hero_tagline, hero_logo, hero_bg,
  overview_paragraphs, overview_highlights, amenities, specifications,
  location_image, location_map_embed, location_destinations,
  walkthrough_video_id, gallery_images, brochure_url,
  meta_title, meta_description, is_published
)
values (
  v_project_id,
  'One Victoria',
  'Residential & Retail / Apartment Complex',
  '/projects/one-victoria-new-town/project-logo.png',
  '/projects/one-victoria-new-town/hero.webp',
  '["Amidst the fast-paced streets of Newtown, ONE VICTORIA, a retail & apartment complex stands as a tranquil haven, seamlessly blending luxury residences with cutting-edge retail spaces. Located in the thriving Action Area-1, Newtown, relish in the perfect blend of convenience with excellent connectivity.","Choose more than a home or workplace; choose a lifestyle. With Newtown''s vibrant community, cultural richness, and futuristic urban planning, One Victoria emerges as the premier address for those seeking the best in both living and business."]'::jsonb,
  '[{"label":"Possession","desc":"2029","icon":"infrastructure"},{"label":"Location","desc":"Action Area 1, New Town, Kolkata","icon":"location"},{"label":"Flats Type","desc":"3/4 BHK 3 Cr.* onwards","icon":"size"},{"label":"Near To","desc":"Next to Novotel, beside Axis Mall","icon":"amenities"}]'::jsonb,
  '[{"name":"Community Hall with Spill Over Area","icon":"hall"},{"name":"Party Cabana","icon":"hall"},{"name":"Swimming Pool","icon":"pool"},{"name":"Jacuzzi","icon":"spa"},{"name":"Forest Meditation Cabana","icon":"meditation"},{"name":"Pool Loungers","icon":"pool"},{"name":"Poolside Cabanas","icon":"pool"},{"name":"Covered Walkway Under Pergola","icon":"garden"},{"name":"Yoga Lawn","icon":"yoga"},{"name":"State-of-the-Art Multi Gym","icon":"gym"},{"name":"Stepped Seating","icon":"hall"},{"name":"Action Station","icon":"games"},{"name":"Kids Play Area","icon":"playground"},{"name":"Open Badminton Court","icon":"badminton"},{"name":"Amphitheatre","icon":"hall"},{"name":"Star Gazing Deck","icon":"lounge"}]'::jsonb,
  '[{"title":"Location Context","desc":"At One Victoria, the best of East Kolkata is outside your doorstep. Whether you travel by metro, cab or flight, commuting from one place to another will be simplified beyond your expectations.","image":"/projects/one-victoria-new-town/gallery/gallery-1.webp"},{"title":"Project Details","desc":"Residential + Retail / Apartment Complex. RERA: WBRERA/P/NOR/2024/001080. Phone: 033 6902 9144. Email: info@ruchirealty.com","image":"/projects/one-victoria-new-town/gallery/gallery-2.webp"},{"title":"__hero_mobile_url__","desc":"/projects/one-victoria-new-town/hero-mobile.webp"},{"title":"__company_logo_url__","desc":"/projects/one-victoria-new-town/company-logo.png"},{"title":"__floor_plans__","desc":"[{\"title\":\"Typical Floor Plan\",\"desc\":\"/projects/one-victoria-new-town/plans/typical-floor-plan.jpg\"},{\"title\":\"Star Gazing Deck\",\"desc\":\"/projects/one-victoria-new-town/plans/star-gazing-deck.jpg\"},{\"title\":\"Podium Plan\",\"desc\":\"/projects/one-victoria-new-town/plans/podium-plan.jpg\"}]"},{"title":"__video_section__","desc":"{\"enabled\":false,\"title\":\"Project Walkthrough\",\"videoUrl\":\"\",\"thumbnailUrl\":\"\"}"}]'::jsonb,
  '/projects/one-victoria-new-town/location.webp',
  '',
  '[{"name":"Novotel Hotel","dist":"0.8 km"},{"name":"Metro Station","dist":"0.2 km"},{"name":"Amity University","dist":"4.7 km"},{"name":"Newtown Bus Stop","dist":"0.7 km"},{"name":"Eco Park","dist":"3.6 km"},{"name":"Axis Mall","dist":"0.1 km"},{"name":"Airport","dist":"12 km"},{"name":"Tata Medical Center","dist":"2.8 km"}]'::jsonb,
  null,
  '[{"src":"/projects/one-victoria-new-town/gallery/gallery-1.webp","alt":"One Victoria gallery image 1","category":"Gallery"},{"src":"/projects/one-victoria-new-town/gallery/gallery-2.webp","alt":"One Victoria gallery image 2","category":"Gallery"},{"src":"/projects/one-victoria-new-town/gallery/gallery-3.webp","alt":"One Victoria gallery image 3","category":"Gallery"},{"src":"/projects/one-victoria-new-town/gallery/gallery-4.webp","alt":"One Victoria gallery image 4","category":"Gallery"},{"src":"/projects/one-victoria-new-town/gallery/gallery-5.webp","alt":"One Victoria gallery image 5","category":"Gallery"},{"src":"/projects/one-victoria-new-town/gallery/gallery-6.webp","alt":"One Victoria gallery image 6","category":"Gallery"},{"src":"/projects/one-victoria-new-town/gallery/construction-1.jpeg","alt":"One Victoria construction update 1","category":"Construction"},{"src":"/projects/one-victoria-new-town/gallery/construction-2.jpeg","alt":"One Victoria construction update 2","category":"Construction"},{"src":"/projects/one-victoria-new-town/gallery/construction-3.jpeg","alt":"One Victoria construction update 3","category":"Construction"}]'::jsonb,
  '',
  'One Victoria New Town - Ruchi Realty',
  'One Victoria is an ongoing residential and retail development in Action Area 1, New Town, Kolkata, offering 3/4 BHK apartments from 3 Cr.* onwards, located next to Novotel and beside Axis Mall.',
  true
)
on conflict (project_id) do update set
  hero_title = excluded.hero_title,
  hero_tagline = excluded.hero_tagline,
  hero_logo = excluded.hero_logo,
  hero_bg = excluded.hero_bg,
  overview_paragraphs = excluded.overview_paragraphs,
  overview_highlights = excluded.overview_highlights,
  amenities = excluded.amenities,
  specifications = excluded.specifications,
  location_image = excluded.location_image,
  location_map_embed = excluded.location_map_embed,
  location_destinations = excluded.location_destinations,
  walkthrough_video_id = excluded.walkthrough_video_id,
  gallery_images = excluded.gallery_images,
  brochure_url = excluded.brochure_url,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  is_published = excluded.is_published,
  updated_at = timezone('utc'::text, now());
end $$;

-- Verification
select p.title, sp.hero_title, jsonb_array_length(sp.specifications) as specification_records,
       sp.is_published, sp.updated_at
from public.project_subpages sp
join public.projects p on p.id = sp.project_id
where p.title ilike '%One Victoria%';