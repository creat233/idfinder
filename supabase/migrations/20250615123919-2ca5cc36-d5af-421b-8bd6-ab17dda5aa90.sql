
-- Create a table for mCards (digital business cards)
CREATE TABLE public.mcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  job_title TEXT,
  company TEXT,
  phone_number TEXT,
  email TEXT,
  website_url TEXT,
  profile_picture_url TEXT,
  social_links JSONB,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add comments to explain the columns
COMMENT ON COLUMN public.mcards.slug IS 'The unique URL-friendly identifier for the card.';
COMMENT ON COLUMN public.mcards.social_links IS 'JSON object for social media links, e.g., {"linkedin": "...", "twitter": "..."}';
COMMENT ON COLUMN public.mcards.is_published IS 'If true, the card is publicly accessible via its slug.';

-- Enable Row Level Security
ALTER TABLE public.mcards ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can see their own mCards
CREATE POLICY "Users can view their own mCards"
  ON public.mcards
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can create mCards for themselves
CREATE POLICY "Users can create their own mCards"
  ON public.mcards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own mCards
CREATE POLICY "Users can update their own mCards"
  ON public.mcards
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policy: Users can delete their own mCards
CREATE POLICY "Users can delete their own mCards"
  ON public.mcards
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policy: Public can view published mCards
CREATE POLICY "Public can view published mCards"
  ON public.mcards
  FOR SELECT
  USING (is_published = true);

-- Add a trigger to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mcards_updated_at
  BEFORE UPDATE
  ON public.mcards
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();
