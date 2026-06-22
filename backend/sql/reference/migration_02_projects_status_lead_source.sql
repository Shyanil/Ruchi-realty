-- Ruchi Realty — round 2 schema updates.
--
-- Run this ONCE in the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run).
--
-- 1) projects.status  — an editable status badge for each project
--    (e.g. "For Sale", "New Launch", "Ongoing", "Ready to Move", "Sold Out").
--    Lets new admin-added projects carry the same badge the built-in ones show.
--    Until this exists, adding/editing a project from the admin panel will fail.
--
-- 2) leads.source        — which form/page the enquiry came from
--    ("Project Detail", "Contact Page", "Land & Leasing", "Home Contact Section").
--    leads.project_slug   — the specific project the enquiry is about (when the
--    lead came from a project page), so you can tell which form was filled for
--    which project. General enquiries leave project_slug empty.

-- 1) Projects: status badge
alter table public.projects
  add column if not exists status text;

-- 2) Leads: form source + project reference
alter table public.leads
  add column if not exists source       text,
  add column if not exists project_slug text;
