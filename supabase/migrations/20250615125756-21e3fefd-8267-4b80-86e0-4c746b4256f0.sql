
ALTER TABLE public.mcards
ADD COLUMN description TEXT;

COMMENT ON COLUMN public.mcards.description IS 'A short description or bio for the business card.';
