-- ============================================================
-- Auto-create project subpages for admin-created projects
-- Run after project_subpages.sql.
-- ============================================================

create or replace function public.create_default_project_subpage()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.project_subpages (
    project_id,
    hero_title,
    hero_tagline,
    hero_bg,
    overview_paragraphs,
    overview_highlights,
    meta_title,
    meta_description,
    is_published
  ) values (
    new.id,
    coalesce(new.title, 'Project'),
    coalesce(new.tag, new.description, ''),
    coalesce(new.image_url, ''),
    case
      when nullif(new.description, '') is null then '[]'::jsonb
      else jsonb_build_array(new.description)
    end,
    '[
      {"label":"Prime Location","desc":"Well-connected address with everyday conveniences close by.","icon":"location"},
      {"label":"Lifestyle Amenities","desc":"Thoughtfully planned spaces for daily comfort and community living.","icon":"amenities"},
      {"label":"Quality Infrastructure","desc":"Designed with dependable services, security, and long-term usability.","icon":"infrastructure"},
      {"label":"Flexible Spaces","desc":"Practical layouts planned for modern residential and investment needs.","icon":"size"}
    ]'::jsonb,
    coalesce(new.title, 'Project') || ' | Ruchi Realty',
    coalesce(new.description, ''),
    true
  ) on conflict (project_id) do nothing;

  return new;
end;
$$;

drop trigger if exists create_default_project_subpage_after_project_insert on public.projects;

create trigger create_default_project_subpage_after_project_insert
after insert on public.projects
for each row
execute function public.create_default_project_subpage();

insert into public.project_subpages (
  project_id,
  hero_title,
  hero_tagline,
  hero_bg,
  overview_paragraphs,
  overview_highlights,
  meta_title,
  meta_description,
  is_published
)
select
  p.id,
  coalesce(p.title, 'Project'),
  coalesce(p.tag, p.description, ''),
  coalesce(p.image_url, ''),
  case
    when nullif(p.description, '') is null then '[]'::jsonb
    else jsonb_build_array(p.description)
  end,
  '[
    {"label":"Prime Location","desc":"Well-connected address with everyday conveniences close by.","icon":"location"},
    {"label":"Lifestyle Amenities","desc":"Thoughtfully planned spaces for daily comfort and community living.","icon":"amenities"},
    {"label":"Quality Infrastructure","desc":"Designed with dependable services, security, and long-term usability.","icon":"infrastructure"},
    {"label":"Flexible Spaces","desc":"Practical layouts planned for modern residential and investment needs.","icon":"size"}
  ]'::jsonb,
  coalesce(p.title, 'Project') || ' | Ruchi Realty',
  coalesce(p.description, ''),
  true
from public.projects p
where not exists (
  select 1 from public.project_subpages sp where sp.project_id = p.id
);