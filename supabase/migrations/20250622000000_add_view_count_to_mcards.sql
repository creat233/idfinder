
-- Add view_count column to mcards table
ALTER TABLE public.mcards 
ADD COLUMN IF NOT EXISTS view_count INT NOT NULL DEFAULT 0;

-- Add comment for the column
COMMENT ON COLUMN public.mcards.view_count IS 'Number of times this mCard has been viewed publicly';

-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_mcard_view_count(mcard_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.mcards
  SET view_count = view_count + 1
  WHERE slug = mcard_slug AND is_published = true;
END;
$$;
