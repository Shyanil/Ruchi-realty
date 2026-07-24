-- ============================================================
-- Supabase SQL Script: Update Project Statuses
-- Target Table: public.projects
-- Target Columns: title, location, status
--
-- This script updates the status column for projects in the
-- public.projects table while matching both project name (title)
-- and location.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. Unambiguous "Ready to Move" Projects
-- ------------------------------------------------------------
UPDATE public.projects
SET status = 'Ready to Move'
WHERE (title ILIKE '%Active Business Park%' AND location ILIKE '%Kolkata%')
   OR (title ILIKE '%Active Green%' AND location ILIKE '%Kolkata%')
   OR (title ILIKE '%One Rajarhat%' AND location ILIKE '%Kolkata%')
   OR (title ILIKE '%One Prime%' AND location ILIKE '%Kolkata%')
   OR (title ILIKE '%Active Acres%' AND title NOT ILIKE '%Angelica%' AND location ILIKE '%Kolkata%')
   OR (title ILIKE '%Oscar Billionaires%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Ruchi Enclave%' AND location ILIKE '%Indore%');

-- ------------------------------------------------------------
-- 2. Unambiguous "Ongoing" Projects
-- ------------------------------------------------------------
UPDATE public.projects
SET status = 'Ongoing'
WHERE (title ILIKE '%Angelica%' AND location ILIKE '%Kolkata%')
   OR (title ILIKE '%One Victoria%' AND location ILIKE '%Kolkata%')
   OR (title ILIKE '%Oscar Sanctuary%' AND location ILIKE '%Indore%');

-- ------------------------------------------------------------
-- 3. Duplicate Projects (Listed under BOTH Ready to Move & Ongoing)
-- Note: Uncomment the desired block below for duplicate projects
-- once their final status is chosen.
-- ------------------------------------------------------------

/*
-- OPTION A: Set duplicate projects to 'Ready to Move'
UPDATE public.projects
SET status = 'Ready to Move'
WHERE (title ILIKE '%Oscar Fort%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Oscar Pride%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Anand Vihar%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Ruchi Lifescapes%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Oscar Palace%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Saatvik Green%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Ruchi Lifescapes%' AND location ILIKE '%Bhopal%')
   OR (title ILIKE '%Saatvik Vihar%' AND location ILIKE '%Indore%');
*/

/*
-- OPTION B: Set duplicate projects to 'Ongoing'
UPDATE public.projects
SET status = 'Ongoing'
WHERE (title ILIKE '%Oscar Fort%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Oscar Pride%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Anand Vihar%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Ruchi Lifescapes%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Oscar Palace%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Saatvik Green%' AND location ILIKE '%Indore%')
   OR (title ILIKE '%Ruchi Lifescapes%' AND location ILIKE '%Bhopal%')
   OR (title ILIKE '%Saatvik Vihar%' AND location ILIKE '%Indore%');
*/

COMMIT;
