-- Run once in Supabase Dashboard -> SQL Editor after deploying the protected
-- /api/blog-comments endpoint and configuring its environment variables.
-- This closes the old browser-to-Supabase insert path so Turnstile cannot be bypassed.

revoke insert on table public.blog_comments from public, anon, authenticated;

-- Approved comments remain publicly readable through the existing SELECT policy.
-- Comment moderation remains available through the existing authenticated admin policies.
-- The Netlify function inserts with SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
