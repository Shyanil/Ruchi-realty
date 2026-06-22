# Setup Guide — standing the backend up in a new project

Follow these steps to reuse this backend in a fresh project.

## 1. Create a Supabase project
- Go to https://supabase.com → New project.
- Note the **Project URL** and the **anon public key** (Settings → API).

## 2. Create the admin user
- Dashboard → **Authentication → Users → Add user** (email + password).
- This is the account that will log into the admin panel.

## 3. Run the SQL
- Open `sql/00_complete_setup.sql`.
- Near the top, change the email on this line to your admin's email:
  ```sql
  where email = 'YOUR_ADMIN_EMAIL@example.com'
  ```
- Dashboard → **SQL Editor → New query** → paste the **whole file** → **Run**.
- This creates every table, the `is_admin()` helper, all RLS policies, the seed
  `site_settings` row, and (optionally) storage buckets.

> Re-runnable: the script uses `create table if not exists`, `create index if
> not exists`, and `drop policy if exists … create policy …`, so running it again
> is safe.

## 4. Wire the JS client
- Copy the files in `integration/` into your app (e.g. `src/services/` and
  `src/hooks/`).
- In `integration/supabase.js`, replace the blank `url` and `anonKey` with your
  project's values.
- `npm install @supabase/supabase-js`.

## 5. Image uploads
The app stores only an image **URL** in the DB; the file itself lives on a cPanel
host reached via `upload.php`. Two options:

- **Keep cPanel:** set `UPLOAD_ENDPOINT` / `UPLOAD_API_KEY` in `supabase.js` and
  deploy your `upload.php` (see `STORAGE_AND_UPLOADS.md` for the exact contract).
- **Use Supabase Storage instead:** the `00_complete_setup.sql` already creates
  `project-images` and `blog-images` buckets + policies. Swap `uploadAdminImage()`
  to use `supabase.storage.from(bucket).upload(...)` and `.getPublicUrl(...)`.

## 6. Seed content (optional)
- `projects` / `blogs` / `site_settings` start empty (settings has one blank row).
- Add rows via your admin panel, or `insert` directly in the SQL editor.
- Fill the `site_settings` row (phone, email, address, map, socials) from the admin
  Settings screen, or with an `update public.site_settings set … where id = 1;`.

## Dependency map (what the JS layer needs)
| File                 | Needs                                                            |
|----------------------|------------------------------------------------------------------|
| `supabase.js`        | `@supabase/supabase-js`; valid URL + anon key                    |
| `projectService.js`  | `supabase.js`; a seed array (`SEED_PROJECTS`) + helpers — see notes |
| `leadService.js`     | `supabase.js`                                                    |
| `blogService.js`     | `supabase.js`                                                    |
| `settingsService.js` | `supabase.js`; default values (`APP_NAME`, contact/social consts) |
| `use*.js` hooks       | React; the matching service                                     |

> `projectService.getPublicProjects()` merges built-in seed projects with DB rows.
> In a new project, either provide your own `SEED_PROJECTS`/`normalizeProject`/
> `sortByOrder` module, or simplify the service to return DB rows only. See
> `SERVICES_API.md`.
