
-- Create storage bucket for mcard assets (covers, backgrounds)
INSERT INTO storage.buckets (id, name, public)
VALUES ('mcard-assets', 'mcard-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their mcard folder
CREATE POLICY "Users can upload mcard assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'mcard-assets');

-- Public read access
CREATE POLICY "Public can view mcard assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'mcard-assets');

-- Users can update their own assets
CREATE POLICY "Users can update mcard assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'mcard-assets');

-- Users can delete their own assets
CREATE POLICY "Users can delete mcard assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'mcard-assets');

-- Allow visitors to view customization (needed for cover photo display)
CREATE POLICY "Anyone can view customization of published mcards"
ON public.mcard_customization
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM mcards
    WHERE mcards.id = mcard_customization.mcard_id
    AND mcards.is_published = true
  )
);
