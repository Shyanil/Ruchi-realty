# Database Reference

All tables live in the `public` schema. Primary keys are UUIDs (via `gen_random_uuid()`)
unless noted. Timestamps are `timestamptz`, stored in UTC.

---

## `profiles`
Marks which authenticated users are admins. Backs the `is_admin()` function used in
every admin RLS policy.

| Column      | Type        | Notes                                             |
|-------------|-------------|---------------------------------------------------|
| `id`        | uuid (PK)   | FK → `auth.users.id`, `on delete cascade`         |
| `email`     | text        |                                                   |
| `role`      | text        | default `admin`; check in (`admin`, `agent`)      |
| `updated_at`| timestamptz | default now()                                     |

---

## `projects`
Property catalogue managed from the admin panel.

| Column          | Type        | Notes                                                        |
|-----------------|-------------|--------------------------------------------------------------|
| `id`            | uuid (PK)   |                                                              |
| `created_at`    | timestamptz | default now()                                                |
| `title`         | text        | **required**                                                 |
| `tag`           | text        | **required** — short label (e.g. "Waterfront Residences")    |
| `image_url`     | text        | **required** — public URL (from cPanel/Storage upload)       |
| `location`      | text        | **required**                                                 |
| `description`   | text        | nullable                                                     |
| `type`          | text        | **required**; check in (`Residential`,`Commercial`,`Township`,`Land`,`Leasing`) |
| `status`        | text        | nullable — badge text (For Sale / New Launch / Ongoing / …)  |
| `featured`      | boolean     | default `false` — show in home Featured carousel             |
| `sort_order`    | integer     | nullable — order on Projects page (lower first; nulls last)  |
| `feature_order` | integer     | nullable — order within the Featured carousel                |

Indexes: `sort_order`, `feature_order`.

---

## `leads`
Enquiry submissions from every form (project detail, contact, land & leasing, home).

| Column         | Type        | Notes                                                    |
|----------------|-------------|----------------------------------------------------------|
| `id`           | uuid (PK)   |                                                          |
| `created_at`   | timestamptz | default now()                                            |
| `name`         | text        | **required**                                             |
| `email`        | text        | **required**                                             |
| `phone`        | text        | **required**                                             |
| `interest`     | text        | **required** — project name or topic                     |
| `source`       | text        | nullable — which form/page ("Project Detail", "Contact Page", …) |
| `project_slug` | text        | nullable — specific project the enquiry is about         |
| `status`       | text        | default `new`; check in (`new`,`contacted`,`qualified`,`lost`,`closed`) |
| `notes`        | text        | nullable — admin notes                                   |

---

## `blogs`
Articles managed from the admin panel.

| Column        | Type        | Notes                                                       |
|---------------|-------------|-------------------------------------------------------------|
| `id`          | uuid (PK)   |                                                             |
| `created_at`  | timestamptz | default now()                                               |
| `title`       | text        | **required**                                                |
| `slug`        | text        | **required, unique**                                        |
| `excerpt`     | text        | **required**                                                |
| `content`     | text        | **required**                                                |
| `author`      | text        | default `Admin`                                             |
| `image`       | text        | **required** — public URL                                   |
| `tags`        | text[]      | default `{}`                                                |
| `category`    | text        | default `News`; check in (`News`,`Buying Guide`,`Market Trends`,`Investment`) |
| `featured`    | boolean     | default `false`                                             |
| `published_at`| timestamptz | default now()                                               |

Indexes: `category`, `featured`.

---

## `blog_comments`
Public comment submissions; admins moderate. Has an `updated_at` trigger.

| Column        | Type        | Notes                                                       |
|---------------|-------------|-------------------------------------------------------------|
| `id`          | uuid (PK)   |                                                             |
| `blog_id`     | uuid        | **required**; FK → `blogs.id`, `on delete cascade`          |
| `created_at`  | timestamptz | default now()                                               |
| `updated_at`  | timestamptz | default now(); auto-bumped by `set_updated_at()` trigger    |
| `name`        | text        | **required**                                                |
| `email`       | text        | **required**                                                |
| `comment`     | text        | **required**                                                |
| `status`      | text        | default `pending`; check in (`pending`,`approved`,`rejected`,`spam`) |
| `admin_notes` | text        | nullable                                                    |

Indexes: `blog_id`, `status`, `created_at desc`.

---

## `site_settings`
**Single-row** table (enforced by `check (id = 1)`) holding editable contact / site
config. The seed row (`id = 1`) is inserted blank; the app falls back to code
defaults until columns are filled from the admin Settings screen.

| Column          | Type        | Notes                                              |
|-----------------|-------------|----------------------------------------------------|
| `id`            | integer (PK)| always `1`                                         |
| `site_name`     | text        |                                                    |
| `phone`         | text        | shown as a `tel:` link                             |
| `whatsapp`      | text        | digits only (e.g. `919875656616`) → `wa.me` links  |
| `email`         | text        | shown as a `mailto:` link                          |
| `address`       | text        |                                                    |
| `working_hours` | text        |                                                    |
| `map_embed_url` | text        | Google Maps iframe `src` (…`&output=embed`)        |
| `map_link`      | text        | normal "open in maps" link                         |
| `facebook`      | text        |                                                    |
| `instagram`     | text        |                                                    |
| `youtube`       | text        |                                                    |
| `linkedin`      | text        |                                                    |
| `updated_at`    | timestamptz | default now()                                      |

See `AUTH_AND_RLS.md` for who can read/write each table.
