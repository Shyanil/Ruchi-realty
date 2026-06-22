# Images: Storage & Uploads

The database stores only an **image URL** (`projects.image_url`, `blogs.image`).
The actual file is hosted elsewhere. There are two supported approaches.

---

## Approach A — cPanel `upload.php` (what this app uses)

`integration/supabase.js → uploadAdminImage(file, folder)` posts the file to a small
PHP endpoint on the cPanel host and stores the returned public URL.

### Client config (in `supabase.js`)
```js
const UPLOAD_ENDPOINT = ''; // e.g. '/upload.php' for same-origin production
const UPLOAD_API_KEY = '';  // shared secret from your image host
```

### HTTP contract
**Request** — `POST {UPLOAD_ENDPOINT}`
- Header: `X-API-KEY: <UPLOAD_API_KEY>`
- Body: `multipart/form-data`
  - `folder` — destination subfolder (the app passes `"projects"` or `"blogs"`)
  - `image`  — the file (must be `.webp`, ≤ 200 KB; enforced client-side by `validateAdminImage`)

**Success response** — HTTP 200, JSON:
```json
{ "success": true, "url": "https://yourdomain.com/uploads/projects/abc.webp" }
```
**Error response** — non-200 or `{ "success": false, "error": "message" }`.

### What `upload.php` must do (you implement/deploy this on cPanel)
1. Check `X-API-KEY` matches the server-side secret; reject otherwise.
2. Validate the upload is a real `.webp` within the size limit.
3. Save it under `uploads/<folder>/` with a unique name.
4. Return `{ "success": true, "url": "<public URL of the saved file>" }`.

> The PHP source isn't part of this package (it lives on the cPanel host). The
> contract above is everything the client depends on — any endpoint that honours it
> will work. In local dev, `vite.config.js` proxies `/upload.php` to the live domain
> so the browser stays same-origin.

### Image rules (client-side, `validateAdminImage`)
- **Format:** `.webp` only.
- **Size:** ≤ 200 KB.
Adjust `MAX_IMAGE_SIZE_BYTES` / the type check in `supabase.js` to change these.

---

## Approach B — Supabase Storage (no PHP needed)

`sql/00_complete_setup.sql` already creates two public buckets and policies:
`project-images` and `blog-images` (admin-only writes, public reads).

To use them, replace `uploadAdminImage()` with:
```js
export const uploadAdminImage = async (file, folder) => {
  const validationError = validateAdminImage(file);
  if (validationError) return { data: null, error: new Error(validationError) };

  const bucket = folder === 'blogs' ? 'blog-images' : 'project-images';
  const path = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: 'image/webp',
  });
  if (error) return { data: null, error };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { data: data.publicUrl, error: null };
};
```
Everything else (storing the returned URL in `image_url` / `image`) stays the same.

Pick whichever host you prefer — the rest of the backend doesn't care where the URL
points.
