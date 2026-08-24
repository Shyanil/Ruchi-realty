-- One Victoria, New Town: official project content and local media.
-- Run this after deploying the matching files in public/projects/one-victoria-new-town/.
-- Gallery uses WebP thumbnails plus JPEG lightbox images; construction is separate.

-- Bring older project_subpages installations up to the fields used by the admin.
ALTER TABLE public.project_subpages
  ADD COLUMN IF NOT EXISTS hero_title text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_tagline text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_bg text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_logo text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_mobile_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_image_position text DEFAULT 'center center',
  ADD COLUMN IF NOT EXISTS hero_image_fit text DEFAULT 'cover',
  ADD COLUMN IF NOT EXISTS overview_paragraphs jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS overview_highlights jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS amenities jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS specification_image text DEFAULT '',
  ADD COLUMN IF NOT EXISTS floor_plans jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS location_image text DEFAULT '',
  ADD COLUMN IF NOT EXISTS location_map_embed text DEFAULT '',
  ADD COLUMN IF NOT EXISTS location_destinations jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS walkthrough_video_id text DEFAULT '',
  ADD COLUMN IF NOT EXISTS videos jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS construction_updates jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS brochure_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS related_project_slugs jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cta_labels jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS og_image text DEFAULT '',
  ADD COLUMN IF NOT EXISTS meta_title text DEFAULT '',
  ADD COLUMN IF NOT EXISTS meta_description text DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;

UPDATE public.projects
SET tag = 'Starting from Rs. 3 Cr.*',
    image_url = '/projects/one-victoria-new-town/hero.webp',
    location = 'Action Area 1, New Town, Kolkata',
    description = 'Amidst the fast-paced streets of Newtown, ONE VICTORIA, a retail & apartment complex stands as a tranquil haven, seamlessly blending luxury residences with cutting-edge retail spaces. Located in the thriving Action Area-1, Newtown, relish in the perfect blend of convenience with excellent connectivity.',
    status = 'Ongoing'
WHERE lower(trim(title)) = 'one victoria';

UPDATE public.project_subpages AS subpage
SET hero_title = 'One Victoria',
    hero_tagline = 'Starting from Rs. 3 Cr.*',
    hero_bg = '/projects/one-victoria-new-town/hero.webp',
    hero_mobile_url = '/projects/one-victoria-new-town/hero-mobile.webp',
    hero_image_position = 'center center',
    hero_image_fit = 'cover',
    overview_paragraphs = jsonb_build_array(
      'Amidst the fast-paced streets of Newtown, ONE VICTORIA, a retail & apartment complex stands as a tranquil haven, seamlessly blending luxury residences with cutting-edge retail spaces. Located in the thriving Action Area-1, Newtown, relish in the perfect blend of convenience with excellent connectivity.',
      'Choose more than a home or workplace; choose a lifestyle. With Newtown''s vibrant community, cultural richness, and futuristic urban planning, One Victoria emerges as the premier address for those seeking the best in both living and business.'
    ),
    overview_highlights = jsonb_build_array(
      jsonb_build_object('label','Possession','desc','2029','icon','infrastructure'),
      jsonb_build_object('label','Location','desc','Action Area 1, New Town, Kolkata','icon','location'),
      jsonb_build_object('label','Flats Type','desc','3/4 BHK 3 Cr.* onwards','icon','size'),
      jsonb_build_object('label','Near To','desc','Next to Novotel, beside Axis Mall','icon','amenities')
    ),
    amenities = jsonb_build_array(
      jsonb_build_object('name','Community Hall with Spill Over Area','icon','hall'),
      jsonb_build_object('name','Party Cabana','icon','hall'), jsonb_build_object('name','Swimming Pool','icon','pool'),
      jsonb_build_object('name','Jacuzzi','icon','spa'), jsonb_build_object('name','Forest Meditation Cabana','icon','meditation'),
      jsonb_build_object('name','Pool Loungers','icon','pool'), jsonb_build_object('name','Poolside Cabanas','icon','pool'),
      jsonb_build_object('name','Covered Walkway Under Pergola','icon','garden'), jsonb_build_object('name','Yoga Lawn','icon','yoga'),
      jsonb_build_object('name','State-of-the-Art Multi Gym','icon','gym'), jsonb_build_object('name','Stepped Seating','icon','hall'),
      jsonb_build_object('name','Action Station','icon','games'), jsonb_build_object('name','Kids Play Area','icon','playground'),
      jsonb_build_object('name','Open Badminton Court','icon','badminton'), jsonb_build_object('name','Amphitheatre','icon','hall'),
      jsonb_build_object('name','Star Gazing Deck','icon','lounge')
    ),
    specifications = jsonb_build_array(
      jsonb_build_object('title','Location Context','desc','At One Victoria, the best of East Kolkata is outside your doorstep. Whether you travel by metro, cab or flight, commuting from one place to another will be simplified beyond your expectations.','image','/projects/one-victoria-new-town/gallery/gallery-1.webp'),
      jsonb_build_object('title','Project Details','desc','Residential + Retail / Apartment Complex. RERA: WBRERA/P/NOR/2024/001080. Phone: 033 6902 9144. Email: emarketing@ruchirealty.com','image','/projects/one-victoria-new-town/gallery/gallery-2.webp')
    ),
    floor_plans = jsonb_build_array(
      jsonb_build_object('title','Typical Floor Plan','desc','/projects/one-victoria-new-town/plans/typical-floor-plan.webp'),
      jsonb_build_object('title','Star Gazing Deck','desc','/projects/one-victoria-new-town/plans/star-gazing-deck.webp'),
      jsonb_build_object('title','Podium Plan','desc','/projects/one-victoria-new-town/plans/podium-plan.webp'),
      jsonb_build_object('title','Site Plan','desc','/projects/one-victoria-new-town/plans/site-plan.webp')
    ),
    location_image = '/projects/one-victoria-new-town/location.webp',
    location_map_embed = '',
    location_destinations = jsonb_build_array(
      jsonb_build_object('name','Novotel Hotel','dist','0.8 km'), jsonb_build_object('name','Metro Station','dist','0.2 km'),
      jsonb_build_object('name','Amity University','dist','4.7 km'), jsonb_build_object('name','Newtown Bus Stop','dist','0.7 km'),
      jsonb_build_object('name','Eco Park','dist','3.6 km'), jsonb_build_object('name','Axis Mall','dist','0.1 km'),
      jsonb_build_object('name','Airport','dist','12 km'), jsonb_build_object('name','Tata Medical Center','dist','2.8 km')
    ),
    gallery_images = jsonb_build_array(
      jsonb_build_object('src','/projects/one-victoria-new-town/gallery/gallery-1.webp','largeSrc','/projects/one-victoria-new-town/gallery/gallery-1-large.webp','alt','One Victoria gallery image 1','category','Gallery'),
      jsonb_build_object('src','/projects/one-victoria-new-town/gallery/gallery-2.webp','largeSrc','/projects/one-victoria-new-town/gallery/gallery-2-large.webp','alt','One Victoria gallery image 2','category','Gallery'),
      jsonb_build_object('src','/projects/one-victoria-new-town/gallery/gallery-3.webp','largeSrc','/projects/one-victoria-new-town/gallery/gallery-3-large.webp','alt','One Victoria gallery image 3','category','Gallery'),
      jsonb_build_object('src','/projects/one-victoria-new-town/gallery/gallery-4.webp','largeSrc','/projects/one-victoria-new-town/gallery/gallery-4-large.webp','alt','One Victoria gallery image 4','category','Gallery'),
      jsonb_build_object('src','/projects/one-victoria-new-town/gallery/gallery-5.webp','largeSrc','/projects/one-victoria-new-town/gallery/gallery-5-large.webp','alt','One Victoria gallery image 5','category','Gallery'),
      jsonb_build_object('src','/projects/one-victoria-new-town/gallery/gallery-6.webp','largeSrc','/projects/one-victoria-new-town/gallery/gallery-6-large.webp','alt','One Victoria gallery image 6','category','Gallery')
    ),
    construction_updates = jsonb_build_array(
      jsonb_build_object('src','/projects/one-victoria-new-town/gallery/construction-1.webp','alt','One Victoria construction update 1','category','Construction'),
      jsonb_build_object('src','/projects/one-victoria-new-town/gallery/construction-2.webp','alt','One Victoria construction update 2','category','Construction'),
      jsonb_build_object('src','/projects/one-victoria-new-town/gallery/construction-3.webp','alt','One Victoria construction update 3','category','Construction')
    ),
    meta_title = 'One Victoria New Town - Ruchi Realty',
    meta_description = 'One Victoria is an ongoing residential and retail development in Action Area 1, New Town, Kolkata, offering 3/4 BHK apartments from Rs. 3 Cr.* onwards, next to Novotel and beside Axis Mall.',
    og_image = '/projects/one-victoria-new-town/hero.webp', is_published = true
FROM public.projects AS project
WHERE subpage.project_id = project.id AND lower(trim(project.title)) = 'one victoria';

-- Verify that both statements updated one row before committing the migration.
SELECT p.title, p.image_url, s.hero_bg, jsonb_array_length(s.floor_plans) AS floor_plan_count,
       jsonb_array_length(s.gallery_images) AS gallery_image_count,
       jsonb_array_length(s.construction_updates) AS construction_image_count
FROM public.projects AS p LEFT JOIN public.project_subpages AS s ON s.project_id = p.id
WHERE lower(trim(p.title)) = 'one victoria';
