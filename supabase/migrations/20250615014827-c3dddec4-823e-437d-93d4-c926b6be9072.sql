
-- Create a new public bucket for admin ad media
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin_ads_media', 'admin_ads_media', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for the admin_ads_media bucket

-- Public can view files.
CREATE POLICY "Public can view ad media"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'admin_ads_media' );

-- Admins can insert new media
CREATE POLICY "Admins can insert ad media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'admin_ads_media' AND public.is_admin() );

-- Admins can update media metadata
CREATE POLICY "Admins can update ad media"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'admin_ads_media' AND public.is_admin() );

-- Admins can delete media
CREATE POLICY "Admins can delete ad media"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'admin_ads_media' AND public.is_admin() );
