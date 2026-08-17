/*
# Storage policies for predictions bucket

1. Purpose
   Allows the frontend (anon key) to upload and read animal images
   to the public "predictions" storage bucket. Images are displayed
   in the History page and Dashboard.

2. Policies
   - SELECT (read): public — anyone can view uploaded images
   - INSERT (upload): anon + authenticated can upload
   - UPDATE: anon + authenticated can update
   - DELETE: anon + authenticated can delete
*/

DROP POLICY IF EXISTS "public_read_predictions" ON storage.objects;
CREATE POLICY "public_read_predictions"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'predictions');

DROP POLICY IF EXISTS "anon_upload_predictions" ON storage.objects;
CREATE POLICY "anon_upload_predictions"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'predictions');

DROP POLICY IF EXISTS "anon_update_predictions" ON storage.objects;
CREATE POLICY "anon_update_predictions"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'predictions') WITH CHECK (bucket_id = 'predictions');

DROP POLICY IF EXISTS "anon_delete_predictions" ON storage.objects;
CREATE POLICY "anon_delete_predictions"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'predictions');
