-- ============================================================
-- SQL Update: Seed Overview Highlights Icons for Oscar Billionaires
-- Run this in your Supabase SQL Editor.
-- ============================================================

DO $$
DECLARE
  v_project_id uuid;
BEGIN
  -- Find Oscar Billionaires project ID
  SELECT id INTO v_project_id 
  FROM public.projects 
  WHERE title ILIKE '%Oscar Billionaires%' 
  LIMIT 1;

  -- Update subpage overview highlights with local icon paths
  IF v_project_id IS NOT NULL THEN
    UPDATE public.project_subpages 
    SET overview_highlights = '[
      {"label": "Prime Location", "desc": "Located on Indore Bypass, connected to the city''s best addresses.", "icon": "assets/projects/oscar/icon-location.webp"},
      {"label": "Ample Amenities", "desc": "Club house, tennis court, gazebos, jogging tracks and more.", "icon": "assets/projects/oscar/icon-amenities.webp"},
      {"label": "Urban Infrastructure", "desc": "Storm water mgmt, roadway engineering & electrification.", "icon": "assets/projects/oscar/icon-infrastructure.webp"},
      {"label": "4,000-12,500 SQ. FT.", "desc": "Generous plot sizes crafted for premium living.", "icon": "assets/projects/oscar/icon-size.webp"}
    ]'::jsonb
    WHERE project_id = v_project_id;
  END IF;
END $$;
