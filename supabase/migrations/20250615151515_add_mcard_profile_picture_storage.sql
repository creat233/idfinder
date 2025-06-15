
-- Create a public bucket for mcard profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('mcard-profile-pictures', 'mcard-profile-pictures', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'mcard-profile-pictures' );

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Authenticated Insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'mcard-profile-pictures' AND
  (storage.foldername(name))[1] = (auth.uid())::text
);

-- Allow authenticated users to update their own files
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'mcard-profile-pictures' AND
  (storage.foldername(name))[1] = (auth.uid())::text
)
WITH CHECK (
    bucket_id = 'mcard-profile-pictures' AND
  (storage.foldername(name))[1] = (auth.uid())::text
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'mcard-profile-pictures' AND
  (storage.foldername(name))[1] = (auth.uid())::text
);
