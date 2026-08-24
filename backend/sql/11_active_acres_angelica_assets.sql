-- Active Acres Angelica: official content and fully local WebP media.
-- Deploy public/projects/active-acres-angelica/ before running this script.
-- This migration targets either "Active Acres" or "Active Acres Angelica" so the project card and its subpage stay connected.

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
SET tag = 'Starting from Rs. 2.30 Cr.*',
    image_url = '/projects/active-acres-angelica/hero.webp',
    location = 'Behind JW Marriott, Kolkata',
    description = 'Angelica at Active Acres is a 4 BHK residential development behind JW Marriott, Kolkata, with six acres of outdoor space.',
    status = 'Ongoing'
WHERE lower(trim(title)) IN ('active acres', 'active acres angelica');

UPDATE public.project_subpages AS subpage
SET hero_title = 'Angelica - Active Acres',
    hero_tagline = 'Starting from Rs. 2.30 Cr.*',
    hero_logo = '/projects/active-acres-angelica/logo.webp',
    hero_bg = '/projects/active-acres-angelica/hero.webp',
    hero_mobile_url = '/projects/active-acres-angelica/hero-mobile.webp',
    hero_image_position = 'center center',
    hero_image_fit = 'cover',
    overview_paragraphs = jsonb_build_array(
      'One of the largest condominium projects of Kolkata, Active Acres, is spread over 16.38 acres. It has six towers of G+22 comprising 1,050 apartments, with a mix of 2, 3 and 4 BHK homes and penthouses. The idea behind Active Acres has been to provide residents with a superior quality of life.',
      'Architects at Agarwal and Agarwal have used their skill and innovation to bring to life a revolutionary residential complex. Angelica is located behind JW Marriott, Kolkata, with six acres of outdoor space for activity, sports, fun and relaxation.'
    ),
    overview_highlights = jsonb_build_array(
      jsonb_build_object('label','Possession','desc','September 2026','icon','location'),
      jsonb_build_object('label','Location','desc','Behind JW Marriott, Kolkata','icon','home'),
      jsonb_build_object('label','Flats Type','desc','4 BHK from Rs. 2.30 Cr.*','icon','amenities'),
      jsonb_build_object('label','Outdoor Space','desc','6 Acres','icon','security')
    ),
    amenities = jsonb_build_array(
      jsonb_build_object('name','Gymnasium','icon','/projects/active-acres-angelica/amenities/amenity-1.webp'),
      jsonb_build_object('name','Library','icon','/projects/active-acres-angelica/amenities/amenity-2.webp'),
      jsonb_build_object('name','Table Tennis','icon','/projects/active-acres-angelica/amenities/amenity-3.webp'),
      jsonb_build_object('name','Meditation Room','icon','/projects/active-acres-angelica/amenities/amenity-4.webp'),
      jsonb_build_object('name','Lounge','icon','/projects/active-acres-angelica/amenities/amenity-5.webp'),
      jsonb_build_object('name','Squash Courts','icon','/projects/active-acres-angelica/amenities/amenity-6.webp'),
      jsonb_build_object('name','Pool Table','icon','/projects/active-acres-angelica/amenities/amenity-7.webp'),
      jsonb_build_object('name','Air Hockey','icon','/projects/active-acres-angelica/amenities/amenity-8.webp'),
      jsonb_build_object('name','Football Ground','icon','/projects/active-acres-angelica/amenities/amenity-9.webp'),
      jsonb_build_object('name','Play Zone - Billiards Table','icon','/projects/active-acres-angelica/amenities/amenity-10.webp')
    ),
    specifications = jsonb_build_array(
      jsonb_build_object('title','High Speed Elevators','desc','High-speed elevators and 24 hours treated water supply support comfortable everyday living.','image','/projects/active-acres-angelica/gallery/gallery-1.webp'),
      jsonb_build_object('title','Safety & Connectivity','desc','CCTV surveillance, intercom facility, underground electric cabling and fire-fighting arrangements provide reliable support.','image','/projects/active-acres-angelica/gallery/gallery-2.webp'),
      jsonb_build_object('title','Infrastructure','desc','Concrete and interlocking pebble roads, plus power back-up for common areas, create a well-planned residential environment.','image','/projects/active-acres-angelica/gallery/gallery-3.webp'),
      jsonb_build_object('title','Project Details','desc','HIRA Registration No: HIRA/P/KOL/2020/000778. Contact: 033 6902 9144 | emarketing@ruchirealty.com.','image','/projects/active-acres-angelica/gallery/gallery-4.webp'),
      jsonb_build_object('title','__hero_mobile_url__','desc','/projects/active-acres-angelica/hero-mobile.webp'),
      jsonb_build_object('title','__company_logo_url__','desc','/projects/active-acres-angelica/ruchi-logo.webp'),
      jsonb_build_object('title','__gmb_google_icon_url__','desc','/projects/active-acres-angelica/g-icon.webp'),
      jsonb_build_object('title','__gmb_star_icon_url__','desc','/projects/active-acres-angelica/5-star.webp'),
      jsonb_build_object('title','__location_map_url__','desc','/projects/active-acres-angelica/location.webp'),
      jsonb_build_object('title','__floor_plans__','desc', jsonb_build_array(
        jsonb_build_object('title','Master Plan 1','desc','/projects/active-acres-angelica/plans/master-1.webp'),
        jsonb_build_object('title','Master Plan 2','desc','/projects/active-acres-angelica/plans/master-2.webp'),
        jsonb_build_object('title','Master Plan 3','desc','/projects/active-acres-angelica/plans/master-3.webp'),
        jsonb_build_object('title','4 BHK Plan 1','desc','/projects/active-acres-angelica/plans/4bhk-1.webp'),
        jsonb_build_object('title','4 BHK Plan 2','desc','/projects/active-acres-angelica/plans/4bhk-2.webp'),
        jsonb_build_object('title','3 BHK Plan 1','desc','/projects/active-acres-angelica/plans/3bhk-1.webp'),
        jsonb_build_object('title','3 BHK Plan 2','desc','/projects/active-acres-angelica/plans/3bhk-2.webp'),
        jsonb_build_object('title','3 BHK Plan 3','desc','/projects/active-acres-angelica/plans/3bhk-3.webp'),
        jsonb_build_object('title','3 BHK Plan 4','desc','/projects/active-acres-angelica/plans/3bhk-4.webp'),
        jsonb_build_object('title','2 BHK Plan 1','desc','/projects/active-acres-angelica/plans/2bhk-1.webp'),
        jsonb_build_object('title','2 BHK Plan 2','desc','/projects/active-acres-angelica/plans/2bhk-2.webp'),
        jsonb_build_object('title','2 BHK Plan 3','desc','/projects/active-acres-angelica/plans/2bhk-3.webp'),
        jsonb_build_object('title','2 BHK Plan 4','desc','/projects/active-acres-angelica/plans/2bhk-4.webp'),
        jsonb_build_object('title','2 BHK Plan 5','desc','/projects/active-acres-angelica/plans/2bhk-5.webp')
      )::text),
      jsonb_build_object('title','__video_section__','desc', jsonb_build_object('enabled',true,'videoUrl','https://youtu.be/GTYs3ZynAQU','thumbnailUrl','/projects/active-acres-angelica/testimonial-thumbnail.webp')::text),
      jsonb_build_object('title','__gmb_reviews__','desc', jsonb_build_object(
        'enabled',true,
        'googleIconUrl','/projects/active-acres-angelica/g-icon.webp',
        'starIconUrl','/projects/active-acres-angelica/5-star.webp',
        'reviews',jsonb_build_array(
          jsonb_build_object('author','Jyotirmoy Hajra','avatar','/projects/active-acres-angelica/reviews/user-1.webp','rating',5,'time','7 years ago','text','One of the largest condominium projects of Kolkata, Active Acres is spread over 16.38 acres. Its six towers offer 2, 3 and 4 BHK apartments and penthouses, with a focus on activity, outdoor sports, fun and relaxation.'),
          jsonb_build_object('author','MD FAIYAZ','avatar','/projects/active-acres-angelica/reviews/user-2.webp','rating',5,'time','7 months ago','text','Great location and connectivity. The society is great to live in with all amenities, huge indoor and outdoor sports activities, and six acres of land.'),
          jsonb_build_object('author','Shristy Ranka','avatar','/projects/active-acres-angelica/reviews/user-3.webp','rating',5,'time','7 months ago','text','One of the best projects in Kolkata, with good connectivity. Schools, hospitals and markets are very close to the project.'),
          jsonb_build_object('author','Sandip Banerjee','avatar','/projects/active-acres-angelica/reviews/user-4.webp','rating',5,'time','a year ago','text','An extraordinary project in central Kolkata with six acres of open green space, big trees, football, cricket, tennis and basketball, closely connected with the city and airport.')
        )
      )::text)
    ),
    floor_plans = jsonb_build_array(
      jsonb_build_object('title','Master Plan 1','desc','/projects/active-acres-angelica/plans/master-1.webp'),
      jsonb_build_object('title','Master Plan 2','desc','/projects/active-acres-angelica/plans/master-2.webp'),
      jsonb_build_object('title','Master Plan 3','desc','/projects/active-acres-angelica/plans/master-3.webp'),
      jsonb_build_object('title','4 BHK Plan 1','desc','/projects/active-acres-angelica/plans/4bhk-1.webp'),
      jsonb_build_object('title','4 BHK Plan 2','desc','/projects/active-acres-angelica/plans/4bhk-2.webp'),
      jsonb_build_object('title','3 BHK Plan 1','desc','/projects/active-acres-angelica/plans/3bhk-1.webp'),
      jsonb_build_object('title','3 BHK Plan 2','desc','/projects/active-acres-angelica/plans/3bhk-2.webp'),
      jsonb_build_object('title','3 BHK Plan 3','desc','/projects/active-acres-angelica/plans/3bhk-3.webp'),
      jsonb_build_object('title','3 BHK Plan 4','desc','/projects/active-acres-angelica/plans/3bhk-4.webp'),
      jsonb_build_object('title','2 BHK Plan 1','desc','/projects/active-acres-angelica/plans/2bhk-1.webp'),
      jsonb_build_object('title','2 BHK Plan 2','desc','/projects/active-acres-angelica/plans/2bhk-2.webp'),
      jsonb_build_object('title','2 BHK Plan 3','desc','/projects/active-acres-angelica/plans/2bhk-3.webp'),
      jsonb_build_object('title','2 BHK Plan 4','desc','/projects/active-acres-angelica/plans/2bhk-4.webp'),
      jsonb_build_object('title','2 BHK Plan 5','desc','/projects/active-acres-angelica/plans/2bhk-5.webp')
    ),
    location_image = '/projects/active-acres-angelica/location.webp',
    location_map_embed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.636603099951!2d88.38883597603706!3d22.555291233633633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02768f51a44c79%3A0xe5a13318281cb9f2!2sActive%20Acres!5e0!3m2!1sen!2sin!4v1691752959217!5m2!1sen!2sin',
    location_destinations = jsonb_build_array(
      jsonb_build_object('name','JW Marriott','dist','1 km'), jsonb_build_object('name','Hospital','dist','3 km'),
      jsonb_build_object('name','Well Known Schools','dist','2 km'), jsonb_build_object('name','Mall','dist','2 km'),
      jsonb_build_object('name','International Airport','dist','20 km')
    ),
    walkthrough_video_id = 'GTYs3ZynAQU',
    videos = jsonb_build_array(jsonb_build_object('title','Testimonials','videoUrl','https://youtu.be/GTYs3ZynAQU','thumbnailUrl','/projects/active-acres-angelica/testimonial-thumbnail.webp')),
    gallery_images = jsonb_build_array(
      jsonb_build_object('src','/projects/active-acres-angelica/gallery/gallery-1.webp','largeSrc','/projects/active-acres-angelica/gallery/gallery-1-large.webp','alt','Angelica Active Acres gallery image 1','category','Gallery'),
      jsonb_build_object('src','/projects/active-acres-angelica/gallery/gallery-2.webp','largeSrc','/projects/active-acres-angelica/gallery/gallery-2-large.webp','alt','Angelica Active Acres gallery image 2','category','Gallery'),
      jsonb_build_object('src','/projects/active-acres-angelica/gallery/gallery-3.webp','largeSrc','/projects/active-acres-angelica/gallery/gallery-3-large.webp','alt','Angelica Active Acres gallery image 3','category','Gallery'),
      jsonb_build_object('src','/projects/active-acres-angelica/gallery/gallery-4.webp','largeSrc','/projects/active-acres-angelica/gallery/gallery-4-large.webp','alt','Angelica Active Acres gallery image 4','category','Gallery'),
      jsonb_build_object('src','/projects/active-acres-angelica/gallery/gallery-5.webp','largeSrc','/projects/active-acres-angelica/gallery/gallery-5-large.webp','alt','Angelica Active Acres gallery image 5','category','Gallery'),
      jsonb_build_object('src','/projects/active-acres-angelica/gallery/gallery-6.webp','largeSrc','/projects/active-acres-angelica/gallery/gallery-6-large.webp','alt','Angelica Active Acres gallery image 6','category','Gallery'),
      jsonb_build_object('src','/projects/active-acres-angelica/amenities/amenity-1.webp','largeSrc','/projects/active-acres-angelica/amenities/amenity-1.webp','alt','Active Acres Angelica amenity 1','category','Amenities'),
      jsonb_build_object('src','/projects/active-acres-angelica/amenities/amenity-2.webp','largeSrc','/projects/active-acres-angelica/amenities/amenity-2.webp','alt','Active Acres Angelica amenity 2','category','Amenities'),
      jsonb_build_object('src','/projects/active-acres-angelica/amenities/amenity-3.webp','largeSrc','/projects/active-acres-angelica/amenities/amenity-3.webp','alt','Active Acres Angelica amenity 3','category','Amenities'),
      jsonb_build_object('src','/projects/active-acres-angelica/amenities/amenity-4.webp','largeSrc','/projects/active-acres-angelica/amenities/amenity-4.webp','alt','Active Acres Angelica amenity 4','category','Amenities'),
      jsonb_build_object('src','/projects/active-acres-angelica/amenities/amenity-5.webp','largeSrc','/projects/active-acres-angelica/amenities/amenity-5.webp','alt','Active Acres Angelica amenity 5','category','Amenities'),
      jsonb_build_object('src','/projects/active-acres-angelica/amenities/amenity-6.webp','largeSrc','/projects/active-acres-angelica/amenities/amenity-6.webp','alt','Active Acres Angelica amenity 6','category','Amenities'),
      jsonb_build_object('src','/projects/active-acres-angelica/amenities/amenity-7.webp','largeSrc','/projects/active-acres-angelica/amenities/amenity-7.webp','alt','Active Acres Angelica amenity 7','category','Amenities'),
      jsonb_build_object('src','/projects/active-acres-angelica/amenities/amenity-8.webp','largeSrc','/projects/active-acres-angelica/amenities/amenity-8.webp','alt','Active Acres Angelica amenity 8','category','Amenities'),
      jsonb_build_object('src','/projects/active-acres-angelica/amenities/amenity-9.webp','largeSrc','/projects/active-acres-angelica/amenities/amenity-9.webp','alt','Active Acres Angelica amenity 9','category','Amenities'),
      jsonb_build_object('src','/projects/active-acres-angelica/amenities/amenity-10.webp','largeSrc','/projects/active-acres-angelica/amenities/amenity-10.webp','alt','Active Acres Angelica amenity 10','category','Amenities')
    ),
    brochure_url = '',
    meta_title = 'Angelica - Active Acres | 4 BHK Apartments in Kolkata | Ruchi Realty',
    meta_description = 'Angelica at Active Acres offers 4 BHK residences from Rs. 2.30 Cr.* behind JW Marriott, Kolkata, with six acres of outdoor space and a September 2026 possession timeline.',
    og_image = '/projects/active-acres-angelica/hero.webp',
    is_published = true
FROM public.projects AS project
WHERE subpage.project_id = project.id
  AND lower(trim(project.title)) IN ('active acres', 'active acres angelica');

-- Confirm the project now exposes all 14 plans, 16 gallery images and its testimonial media in the admin.
SELECT p.title, p.image_url, s.hero_bg, jsonb_array_length(s.floor_plans) AS floor_plan_count,
       jsonb_array_length(s.gallery_images) AS gallery_image_count, s.walkthrough_video_id
FROM public.projects AS p
LEFT JOIN public.project_subpages AS s ON s.project_id = p.id
WHERE lower(trim(p.title)) IN ('active acres', 'active acres angelica');
