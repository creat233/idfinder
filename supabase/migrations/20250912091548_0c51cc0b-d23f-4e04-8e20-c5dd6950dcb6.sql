-- Add pinned field to mcard_products table
ALTER TABLE public.mcard_products 
ADD COLUMN is_pinned boolean NOT NULL DEFAULT false;

-- Create index for better performance when querying pinned products
CREATE INDEX idx_mcard_products_pinned ON public.mcard_products(is_pinned, mcard_id) WHERE is_pinned = true;