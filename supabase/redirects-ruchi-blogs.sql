-- Reference mapping. Apply equivalent 301 rules at the hosting/CDN layer.
create table if not exists public.blog_redirects (old_path text primary key, new_path text not null, created_at timestamptz not null default now());
insert into public.blog_redirects(old_path,new_path)
select '/' || trim(both '/' from regexp_replace(old_url, '^https?://[^/]+', '')), '/blogs/' || slug from public.blogs where old_url is not null
on conflict(old_path) do update set new_path=excluded.new_path;
