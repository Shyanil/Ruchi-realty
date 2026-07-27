# Ruchi Realty — Development Handoff

This document is for the next development model/engineer. Read it before changing the project.

## Current objective

Continue standardizing and QA-testing every real-estate project detail page. The long-term target is one shared, data-driven project-page system with consistent sections, assets, responsive behavior, admin editing, and canonical URLs.

## Project and tooling

- Workspace: `C:\Shyanil\Ruchi-realty`
- React + Vite + React Router
- Supabase REST integration through `js/backend-client.jsx`
- Main project detail renderer: `src/pages/GenericProjectPage.jsx`
- Main route file: `src/App.jsx`
- Shared styles: `css/site.css`
- Admin editor: `src/pages/AdminPage.jsx`
- Project seed data: `src/data/projects.js` and individual fallback/data modules
- Production check: `npm.cmd run build`

## Completed work

### Project-page architecture

- Legacy project routes were consolidated to `GenericProjectPage` using slug overrides where needed.
- Shared project order is Hero, Overview, Specifications, Amenities, Location, Floor Plans, optional Walkthrough, Gallery, More Projects, and final Download Brochure CTA.
- The standalone Key Information section was removed.
- The duplicate middle Project Brochure section was removed; the final brochure CTA remains.
- Empty optional sections are hidden when their data is genuinely empty.

### Hero and logos

- Shared split hero layout is used for project pages.
- Hero enquiry form was redesigned with better hierarchy, field spacing, labels, focus states, CTA, and privacy copy.
- Project logo containers preserve original logo colors and no longer force a white logo filter/background.
- One Victoria assets are local under `public/projects/one-victoria-new-town`.

### Specifications

- Reusable alternating image/content rows: even rows image left, odd rows image right.
- Mobile rows always show image first, then title/details.
- Specification text is split into readable points/label-value lines when possible.
- Fixed the missing-image rendering bug: `.rimg` inside `.project-spec-row__visual` now receives width/height.
- Missing specification images fall back to another image from the same project/gallery/hero.
- One Victoria fallback data assigns gallery-1 and gallery-2 to its visible specification rows.

### Amenities

- Shared amenity cards use green outline icons and light-green icon backgrounds.
- Amenity icons have consistent sizing/card styling and generic fallback behavior.

### Gallery

- One Victoria uses a compact three-image box gallery instead of the previous large slider.
- Lower-right Previous/Next arrows rotate the visible images.
- Clicking an image opens an in-page lightbox with close, previous, next, and counter controls.
- Other project pages retain the shared gallery grid.

### Walkthrough video

- Added optional `ProjectWalkthrough` section before Gallery.
- Hidden unless a video URL exists.
- YouTube and Vimeo URLs are normalized to embed URLs.
- Admin provides walkthrough heading, video URL, and cover image fields.
- URL is authoritative: saving a URL shows the section; clearing it hides the section. A legacy value cannot override a cleared modern config.

### Admin synchronization

- Added `SpecificationsEditor` to `src/pages/AdminPage.jsx`.
- Each specification can edit title, details, and its own image upload/path.
- Intentionally empty overview paragraphs, highlights, and hero logos stay empty after saving.
- Admin walkthrough copy explains URL-driven visibility.
- Supabase mapping is handled in `js/backend-client.jsx`.

### SQL

- Runnable file: `backend/sql/one-victoria-new-town-editable-sections.sql`
- Corrected after Supabase reported that `projects.slug` does not exist.
- Uses `projects.title ILIKE '%One Victoria%'`, creates the project if missing, and upserts `project_subpages` by UUID.
- Seeds One Victoria specification image paths and an empty walkthrough config.
- Contains no `slug` references.

### Canonical URLs

All project detail pages now use `/projects/:slug`, including One Victoria, One Prime, Oscar Billionaires, Active Acres Angelica, One Rajarhat, Active Business Park, Active Greens, Oscar projects, Saatvik projects, Ruchi projects, and Anand Vihar.

Old root-level and `.html` project URLs redirect to canonical `/projects/...` URLs. Main project cards and backend-generated links were updated.

## Important files

- `src/App.jsx`
- `src/data/projects.js`
- `src/data/oneVictoria.js`
- `src/pages/GenericProjectPage.jsx`
- `src/pages/AdminPage.jsx`
- `css/site.css`
- `js/backend-client.jsx`
- `backend/sql/one-victoria-new-town-editable-sections.sql`

## Verification already completed

The latest production build succeeds:

```powershell
npm.cmd run build
```

`git diff --check` also passes. Vite emits only the existing large-chunk warning.

## Recommended next starting point

1. Run `npm.cmd run build`.
2. Start the dev server with `npm.cmd run dev -- --host 127.0.0.1`.
3. Open `/projects/one-victoria-new-town` and inspect specifications, walkthrough visibility, gallery arrows/lightbox, and canonical links.
4. In `/admin`, edit One Victoria and verify save/refresh behavior for walkthrough URL, specification images, gallery, overview, highlights, and logo removal.
5. Run the SQL file only if the One Victoria row/assets need reseeding.
6. Extend the same admin/data QA to the next project, one project at a time.

## Important caveats

- Refresh the public page after Admin saves; the public page fetches the latest published subpage on route load.
- Supabase RLS must allow public reads of published `project_subpages`.
- Run the SQL migration as a complete file in Supabase SQL Editor.
- Do not reintroduce a `projects.slug` lookup unless the database schema is intentionally migrated; current frontend slugs are derived from title/location.
- `GenericProjectPage.jsx` still imports fallback constants from several legacy page modules. Functional, but these can later move to dedicated data modules.
- The final Download Brochure CTA intentionally remains even without a brochure URL.
- Do not use One Victoria’s old Specifications layout as a reference; only its amenities icon style was used.

## User requirements to preserve

- Premium responsive real-estate presentation.
- Consistent section order and reusable components.
- No broken images, blank cards, undefined values, or awkward empty sections.
- Specifications remain image-plus-text editorial rows; mobile is image first.
- Amenities remain consistent green outline icons with light-green backgrounds.
- Project logos preserve their real brand colors.
- Project detail URLs remain under `/projects/`.
- Admin-edited content is what the public page displays; intentionally removed content must not be silently restored by fallback data.
