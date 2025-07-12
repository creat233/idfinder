-- Créer une table pour stocker les paramètres de personnalisation des mCards
CREATE TABLE public.mcard_customization (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'default',
  animations_enabled BOOLEAN DEFAULT false,
  animation_speed INTEGER DEFAULT 50,
  animation_type TEXT DEFAULT 'fade',
  particles_enabled BOOLEAN DEFAULT false,
  gradients_enabled BOOLEAN DEFAULT true,
  shadows_enabled BOOLEAN DEFAULT true,
  custom_font TEXT DEFAULT 'Inter',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(mcard_id)
);

-- Activer RLS
ALTER TABLE public.mcard_customization ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Users can view their own mcard customization" 
ON public.mcard_customization 
FOR SELECT 
USING (
  mcard_id IN (
    SELECT id FROM public.mcards WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own mcard customization" 
ON public.mcard_customization 
FOR INSERT 
WITH CHECK (
  mcard_id IN (
    SELECT id FROM public.mcards WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own mcard customization" 
ON public.mcard_customization 
FOR UPDATE 
USING (
  mcard_id IN (
    SELECT id FROM public.mcards WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own mcard customization" 
ON public.mcard_customization 
FOR DELETE 
USING (
  mcard_id IN (
    SELECT id FROM public.mcards WHERE user_id = auth.uid()
  )
);

-- Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER update_mcard_customization_updated_at
BEFORE UPDATE ON public.mcard_customization
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Créer une fonction pour obtenir ou créer la personnalisation d'une mCard
CREATE OR REPLACE FUNCTION public.get_or_create_mcard_customization(p_mcard_id UUID)
RETURNS public.mcard_customization
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result public.mcard_customization;
BEGIN
  -- Essayer de récupérer la personnalisation existante
  SELECT * INTO result 
  FROM public.mcard_customization 
  WHERE mcard_id = p_mcard_id;
  
  -- Si elle n'existe pas, la créer
  IF result IS NULL THEN
    INSERT INTO public.mcard_customization (mcard_id)
    VALUES (p_mcard_id)
    RETURNING * INTO result;
  END IF;
  
  RETURN result;
END;
$$;