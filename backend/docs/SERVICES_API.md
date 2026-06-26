# JS Integration Layer — API Reference

All services use `@supabase/supabase-js` and return Supabase-style
`{ data, error }` objects (the hooks wrap these into `{ success, data, error }`).
Files live in `integration/`.

---

## `supabase.js`
- `supabase` — the configured Supabase client (set `url` + `anonKey` here).
- `validateAdminImage(file)` → error string or `null`. Enforces **.webp only,
  ≤ 200 KB**.
- `uploadAdminImage(file, folder)` → `{ data: publicUrl, error }`. Uploads the
  file to Supabase Storage and returns the public URL. See `STORAGE_AND_UPLOADS.md`.

---

## `projectService.js`  (table: `projects`)
| Method | Returns | Notes |
|--------|---------|-------|
| `getAllProjects()` | `{ data, error }` | DB rows only, newest first. For the admin table. |
| `getPublicProjects()` | `{ data, error }` | Built-in **seed** projects merged with DB rows, sorted by `sort_order`. For public pages. |
| `getProjectBySlug(slug)` | `{ data, error }` | Finds one project (seed or DB) by slug. |
| `createProject(data)` | `{ data, error }` | Insert. Accepts `title, tag, image_url, location, description, type, status, featured, sort_order, feature_order`. |
| `updateProject(id, data)` | `{ data, error }` | Update by id (same fields). |
| `deleteProject(id)` | `{ error }` | Delete by id. |

> **Reuse note:** this service imports `SEED_PROJECTS`, `normalizeProject`, and
> `sortByOrder` from a project-specific `data/projects` module (built-in catalogue +
> helpers). For a new project, supply your own seed module **or** strip the merge and
> return `supabase.from('projects').select('*')` ordered by `sort_order`.

---

## `leadService.js`  (table: `leads`)
| Method | Returns | Notes |
|--------|---------|-------|
| `submitLead(data)` | `{ data, error }` | Insert. Reads `name, email, phone, interest, source, project_slug, notes`. Sets `status='new'`. Public-callable. |
| `getAllLeads()` | `{ data, error }` | All leads, newest first (admin). |
| `updateLeadStatus(id, status)` | `{ data, error }` | Set status (`new`→`contacted`→…). |
| `deleteLead(id)` | `{ error }` | Delete by id. |

`source` / `project_slug` let you tell **which form was filled for which project**.

---

## `blogService.js`  (tables: `blogs`, `blog_comments`)
| Method | Returns | Notes |
|--------|---------|-------|
| `getAllBlogs()` | `{ data, error }` | Newest first; each row normalized (tags array, derived read time). |
| `getBlogBySlug(slug)` | `{ data, error }` | Single article. |
| `createBlog(data)` | `{ data, error }` | Auto-generates `slug` + `published_at`. |
| `updateBlog(id, data)` | `{ data, error }` | Update by id. |
| `updateFeatured(id, featured)` | `{ data, error }` | Toggle featured. |
| `deleteBlog(id)` | `{ error }` | Delete by id. |
| `getApprovedComments(blogId)` | `{ data, error }` | Public: approved comments for an article. |
| `createComment(blogId, data)` | `{ data, error }` | Public submit; forced `status='pending'`. |
| `getAllComments()` | `{ data, error }` | Admin: all comments + parent blog title/slug. |
| `updateCommentStatus(id, status)` | `{ data, error }` | Moderate (`approved`/`rejected`/`spam`). |
| `deleteComment(id)` | `{ error }` | Delete by id. |

Also exports `BLOG_CATEGORY_OPTIONS` and `normalizeBlog`.

---

## `settingsService.js`  (table: `site_settings`)
Single-row config with built-in defaults and an in-memory cache.
| Method | Returns | Notes |
|--------|---------|-------|
| `getSettings({ force })` | `{ data, error }` | Reads row `id=1`, merged over `DEFAULT_SETTINGS` (blanks fall back to defaults). Cached. |
| `getCached()` | settings or `null` | Sync access to the cached value. |
| `updateSettings(obj)` | `{ data, error }` | Upserts row `id=1` (admin only). Maps camelCase → snake_case columns. |
| `DEFAULT_SETTINGS` (export) | object | Code defaults (phone/email/address/map/socials). |

> **Reuse note:** `DEFAULT_SETTINGS` is built from `APP_NAME`, `CONTACT_INFO`,
> `SOCIAL_LINKS` in a project constants file. Point it at your own defaults.

---

## React hooks (optional — `integration/use*.js`)
- `useProjects()` → `{ projects, loading, error, refresh, getProject, createProject, updateProject, deleteProject }`
- `useLeads({ autoFetch })` → `{ leads, loading, error, refresh, submitLead, updateStatus, deleteLead }`
- `useSiteSettings()` → settings object (starts from cache/defaults, updates after fetch)

Not using React? Skip the hooks and call the services directly.
