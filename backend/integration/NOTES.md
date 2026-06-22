# integration/ — notes for reuse

These are **verbatim copies** of the live app's backend-access layer. They run in a
browser/React context and use ES modules.

## Install
```bash
npm install @supabase/supabase-js
```
(The `use*.js` hooks also need `react`.)

## Must-change before use
- **`supabase.js`** — `url`, `anonKey`, `UPLOAD_ENDPOINT`, and `UPLOAD_API_KEY`
  are intentionally blank. Fill them only when you have the new Supabase project
  and image-host credentials.

## External dependencies these files expect
The copies keep their original relative imports. In a new project, provide or adjust:

| File                 | Imports it expects                                                |
|----------------------|-------------------------------------------------------------------|
| `projectService.js`  | `./supabase`, and `../data/projects` exporting `SEED_PROJECTS`, `normalizeProject`, `sortByOrder` |
| `settingsService.js` | `./supabase`, and `../utils/constants` exporting `APP_NAME`, `CONTACT_INFO`, `SOCIAL_LINKS` |
| `leadService.js`     | `./supabase`                                                      |
| `blogService.js`     | `./supabase`                                                      |
| `useLeads.js`        | `../services/leadService`                                         |
| `useProjects.js`     | `../services/projectService`                                      |
| `useSiteSettings.js` | `../services/settingsService`                                     |

If you don't need the projects "seed merge" or settings "defaults", you can delete
those imports and simplify (return DB rows directly / hardcode defaults). See
`../docs/SERVICES_API.md` for the per-method behaviour.

## `isMockEnabled()`
The public review build uses `js/backend-client.jsx` for dummy localStorage data.
The files in this folder are the Supabase-facing service layer for the later
production connection.
