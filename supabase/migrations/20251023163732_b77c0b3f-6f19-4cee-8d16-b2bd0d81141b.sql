-- Create table to store featured/sponsored mCard for demo page
CREATE TABLE IF NOT EXISTS public.featured_mcards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mcard_id uuid NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  display_order integer DEFAULT 1
);

-- Only allow one active featured mcard at a time per display order
CREATE UNIQUE INDEX idx_featured_mcards_active ON public.featured_mcards(display_order) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.featured_mcards ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage featured mcards
CREATE POLICY "Admins can manage featured mcards"
ON public.featured_mcards
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Policy: Public can view active featured mcards
CREATE POLICY "Public can view active featured mcards"
ON public.featured_mcards
FOR SELECT
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_featured_mcards_updated_at
  BEFORE UPDATE ON public.featured_mcards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();