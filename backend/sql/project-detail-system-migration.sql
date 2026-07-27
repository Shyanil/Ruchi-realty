-- Ruchi Realty reusable project-detail system
-- Safe to run more than once. Existing project content is preserved.

begin;

alter table public.project_subpages
  add column if not exists hero_mobile_url text,
  add column if not exists hero_image_position text not null default 'center center',
  add column if not exists hero_image_fit text not null default 'cover',
  add column if not exists specification_image text,
  add column if not exists floor_plans jsonb not null default '[]'::jsonb,
  add column if not exists videos jsonb not null default '[]'::jsonb,
  add column if not exists faqs jsonb not null default '[]'::jsonb,
  add column if not exists related_project_slugs jsonb not null default '[]'::jsonb,
  add column if not exists cta_labels jsonb not null default '{"brochure":"Download Brochure","visit":"Book a Visit"}'::jsonb,
  add column if not exists og_image text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'project_subpages_hero_image_fit_check') then
    alter table public.project_subpages add constraint project_subpages_hero_image_fit_check check (hero_image_fit in ('cover','contain'));
  end if;
end $$;

-- Promote legacy custom specification records into first-class fields.
update public.project_subpages sp
set hero_mobile_url = (
  select item->>'desc' from jsonb_array_elements(coalesce(sp.specifications, '[]'::jsonb)) item
  where item->>'title' = '__hero_mobile_url__' and nullif(item->>'desc','') is not null limit 1
)
where nullif(sp.hero_mobile_url,'') is null and exists (
  select 1 from jsonb_array_elements(coalesce(sp.specifications, '[]'::jsonb)) item
  where item->>'title' = '__hero_mobile_url__' and nullif(item->>'desc','') is not null
);

update public.project_subpages sp
set floor_plans = (
  select (item->>'desc')::jsonb from jsonb_array_elements(coalesce(sp.specifications, '[]'::jsonb)) item
  where item->>'title' = '__floor_plans__' and nullif(item->>'desc','') is not null limit 1
)
where sp.floor_plans = '[]'::jsonb and exists (
  select 1 from jsonb_array_elements(coalesce(sp.specifications, '[]'::jsonb)) item
  where item->>'title' = '__floor_plans__' and nullif(item->>'desc','') is not null
);

update public.project_subpages sp
set videos = jsonb_build_array(jsonb_build_object(
  'title', 'Project Walkthrough',
  'videoUrl', sp.walkthrough_video_id,
  'thumbnailUrl', ''
))
where sp.videos = '[]'::jsonb and nullif(sp.walkthrough_video_id,'') is not null;

update public.project_subpages
set og_image = coalesce(nullif(hero_bg,''), og_image)
where nullif(og_image,'') is null;

create or replace function public.create_default_project_subpage()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.project_subpages (
    project_id, hero_title, hero_tagline, hero_bg,
    hero_image_position, hero_image_fit,
    overview_paragraphs, overview_highlights,
    meta_title, meta_description, og_image, is_published
  ) values (
    new.id,
    coalesce(nullif(new.title,''), 'Project'),
    coalesce(nullif(new.tag,''), nullif(new.description,''), ''),
    coalesce(new.image_url, ''),
    'center center', 'cover',
    case when nullif(new.description,'') is null then '[]'::jsonb else jsonb_build_array(new.description) end,
    '[{"label":"Prime Location","desc":"Well-connected address with everyday conveniences close by.","icon":"location"},{"label":"Lifestyle Amenities","desc":"Thoughtfully planned spaces for daily comfort and community living.","icon":"amenities"},{"label":"Quality Infrastructure","desc":"Designed with dependable services, security, and long-term usability.","icon":"infrastructure"},{"label":"Flexible Spaces","desc":"Practical layouts planned for modern residential and investment needs.","icon":"size"}]'::jsonb,
    coalesce(nullif(new.title,''), 'Project') || ' | Ruchi Realty',
    coalesce(new.description, ''),
    coalesce(new.image_url, ''),
    true
  ) on conflict (project_id) do nothing;
  return new;
end;
$$;

drop trigger if exists create_default_project_subpage_after_project_insert on public.projects;
create trigger create_default_project_subpage_after_project_insert
after insert on public.projects
for each row execute function public.create_default_project_subpage();

-- Backfill a reusable subpage for any older project that does not have one.
insert into public.project_subpages (
  project_id, hero_title, hero_tagline, hero_bg, overview_paragraphs,
  overview_highlights, meta_title, meta_description, og_image, is_published
)
select p.id, coalesce(nullif(p.title,''),'Project'), coalesce(nullif(p.tag,''),nullif(p.description,''),''),
  coalesce(p.image_url,''), case when nullif(p.description,'') is null then '[]'::jsonb else jsonb_build_array(p.description) end,
  '[{"label":"Prime Location","desc":"Well-connected address with everyday conveniences close by.","icon":"location"},{"label":"Lifestyle Amenities","desc":"Thoughtfully planned spaces for daily comfort and community living.","icon":"amenities"},{"label":"Quality Infrastructure","desc":"Designed with dependable services, security, and long-term usability.","icon":"infrastructure"},{"label":"Flexible Spaces","desc":"Practical layouts planned for modern residential and investment needs.","icon":"size"}]'::jsonb,
  coalesce(nullif(p.title,''),'Project') || ' | Ruchi Realty', coalesce(p.description,''), coalesce(p.image_url,''), true
from public.projects p
where not exists (select 1 from public.project_subpages sp where sp.project_id=p.id);

commit;
