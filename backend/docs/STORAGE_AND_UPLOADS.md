# Images: Supabase Storage

The database stores only public image URLs:

- `projects.image_url`
- `blogs.image`

The actual files upload to Supabase Storage.

## Buckets

`sql/00_complete_setup.sql` creates:

- `project-images`
- `blog-images`

Both buckets are public for reads. Writes are allowed only for authenticated users
who pass `public.is_admin()`.

Uploads are strict:

- File extension must be `.webp`
- MIME type must be `image/webp`
- File size must be 200 KB or smaller

## Admin Upload Flow

The static admin panel calls `window.RuchiBackend.uploadImage(file, bucket)`.

- Project images upload to `project-images`
- Blog images upload to `blog-images`
- The returned public URL is saved in the matching table row
- Prepare/compress each image as WebP under 200 KB before upload

No service-role key is used in browser code.
