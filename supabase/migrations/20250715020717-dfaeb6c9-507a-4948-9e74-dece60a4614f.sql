-- Créer les policies pour permettre l'accès public aux images des statuts et produits

-- Policy pour les images de statuts (permettre à tous de voir)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('status-images', 'status-images', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy pour les images de produits (permettre à tous de voir)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Créer les policies pour l'accès aux objets dans ces buckets

-- Policies pour status-images
CREATE POLICY "Public access for status images" ON storage.objects
FOR SELECT USING (bucket_id = 'status-images');

CREATE POLICY "Users can upload status images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'status-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their status images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'status-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their status images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'status-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policies pour product-images
CREATE POLICY "Public access for product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);