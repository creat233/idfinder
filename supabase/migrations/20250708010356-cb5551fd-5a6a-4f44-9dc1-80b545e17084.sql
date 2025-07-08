-- Créer une table pour les analytics des MCards
CREATE TABLE public.mcard_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mcard_id UUID NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  favorites_count INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (mcard_id) REFERENCES public.mcards(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.mcard_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view analytics of their own mcards" 
ON public.mcard_analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.mcards 
  WHERE mcards.id = mcard_analytics.mcard_id 
  AND mcards.user_id = auth.uid()
));

CREATE POLICY "Users can update analytics of their own mcards" 
ON public.mcard_analytics 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.mcards 
  WHERE mcards.id = mcard_analytics.mcard_id 
  AND mcards.user_id = auth.uid()
));

CREATE POLICY "Users can insert analytics for their own mcards" 
ON public.mcard_analytics 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.mcards 
  WHERE mcards.id = mcard_analytics.mcard_id 
  AND mcards.user_id = auth.uid()
));

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_mcard_analytics_updated_at
BEFORE UPDATE ON public.mcard_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour initialiser les analytics lors de la création d'une MCard
CREATE OR REPLACE FUNCTION public.initialize_mcard_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.mcard_analytics (mcard_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour créer automatiquement les analytics
CREATE TRIGGER initialize_mcard_analytics_trigger
AFTER INSERT ON public.mcards
FOR EACH ROW
EXECUTE FUNCTION public.initialize_mcard_analytics();