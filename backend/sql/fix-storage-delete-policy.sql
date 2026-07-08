-- Allow authenticated admins to remove uploaded files when deleting images/projects in the admin panel.
-- Run this after the storage buckets and public.is_admin() helper exist.

DROP POLICY IF EXISTS "Admins can delete project-images" ON storage.objects;
CREATE POLICY "Admins can delete project-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-images'
  AND public.is_admin()
);

DROP POLICY IF EXISTS "Admins can delete blog-images" ON storage.objects;
CREATE POLICY "Admins can delete blog-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND public.is_admin()
);