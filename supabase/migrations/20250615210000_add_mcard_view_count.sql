
ALTER TABLE public.mcards
ADD COLUMN view_count INT NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.mcards.view_count IS 'How many times the public mCard has been viewed.';

CREATE OR REPLACE FUNCTION public.increment_mcard_view(card_slug TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.mcards
  SET view_count = view_count + 1
  WHERE slug = card_slug;
END;
$$;
