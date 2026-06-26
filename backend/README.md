# Ruchi Realty — Backend Package

A self-contained, reusable backend for the Ruchi Realty site (and any project
that wants the same setup). The "backend" here is **Supabase (Postgres + Auth +
RLS)** plus a small **JavaScript integration layer** and Supabase Storage uploads.

Everything you need to stand the backend up in a brand-new project is in this folder.

## What's inside

```
ruchi-backend/
├── README.md                     ← you are here
├── sql/
│   └── 00_complete_setup.sql     ← RUN THIS in a fresh Supabase project (one shot)
├── integration/                  ← the JS layer that talks to Supabase
│   ├── supabase.js               ← client + Supabase Storage upload helper
│   ├── projectService.js
│   ├── leadService.js
│   ├── blogService.js
│   ├── settingsService.js
│   ├── useLeads.js               ← React hooks (optional, React projects only)
│   ├── useProjects.js
│   └── useSiteSettings.js
└── docs/
    ├── SETUP_GUIDE.md            ← step-by-step for a new project (start here)
    ├── DATABASE.md              ← every table, column, constraint
    ├── AUTH_AND_RLS.md          ← admin auth + row-level-security model
    ├── SERVICES_API.md          ← every method in the JS layer
    └── STORAGE_AND_UPLOADS.md   ← Supabase Storage upload details
```

## Tech stack

| Layer            | Tech                                                |
|------------------|-----------------------------------------------------|
| Database / Auth  | Supabase (PostgreSQL, Auth, Row Level Security)     |
| DB access (JS)   | `@supabase/supabase-js` v2                          |
| Image hosting    | Supabase Storage (`project-images`, `blog-images`)  |
| Frontend (uses)  | React + Vite (hooks are optional / React-specific)  |

## Tables

| Table            | Purpose                                              | Public read | Who writes      |
|------------------|------------------------------------------------------|-------------|-----------------|
| `profiles`       | Marks which auth users are admins (`is_admin()`)     | auth only   | system / admin  |
| `projects`       | Property catalogue                                   | ✅ anon      | admins          |
| `leads`          | Enquiry submissions from every form                  | ❌           | anyone inserts; admins read/manage |
| `blogs`          | Articles                                             | ✅ anon      | admins          |
| `blog_comments`  | Comments (public submit → admin moderates)           | approved only | anyone submits; admins moderate |
| `site_settings`  | Single-row editable contact / site config            | ✅ anon      | admins          |

## Quick start (TL;DR)

1. Create a Supabase project.
2. **SQL Editor →** paste & run `sql/00_complete_setup.sql`.
3. **Auth → Users →** add your admin user (email + password). The SQL trigger
   automatically creates the matching admin profile.
4. In your app, set the Supabase URL + anon key in `integration/supabase.js`.
5. Keep public signups disabled unless every new Auth user should be an admin.

Full walkthrough: **`docs/SETUP_GUIDE.md`**.

> Current state: `integration/supabase.js` is configured with the project URL and
> anon key. Browser code uses the anon key for public access; RLS protects private
> and admin-only data.
