
-- Add cover image and enhanced customization columns
ALTER TABLE public.mcards 
ADD COLUMN IF NOT EXISTS cover_image_url text;

ALTER TABLE public.mcard_customization 
ADD COLUMN IF NOT EXISTS background_image_url text,
ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#6366f1',
ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#ec4899',
ADD COLUMN IF NOT EXISTS border_radius integer DEFAULT 16,
ADD COLUMN IF NOT EXISTS card_opacity integer DEFAULT 100;
