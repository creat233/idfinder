-- Ajouter un champ pour stocker plusieurs URLs d'images (jusqu'à 6)
ALTER TABLE public.mcard_products 
ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';

-- Migrer les images existantes vers le nouveau champ
UPDATE public.mcard_products 
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL AND (image_urls IS NULL OR image_urls = '{}');

COMMENT ON COLUMN public.mcard_products.image_urls IS 'Array of image URLs for the product (up to 6 images)';