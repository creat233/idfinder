
-- Créer une table pour les codes promo
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '2 months'),
  total_earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
  usage_count INTEGER NOT NULL DEFAULT 0
);

-- Index pour optimiser les recherches
CREATE INDEX idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX idx_promo_codes_user_id ON public.promo_codes(user_id);
CREATE INDEX idx_promo_codes_active ON public.promo_codes(is_active) WHERE is_active = true;

-- Créer une table pour l'historique d'utilisation des codes promo
CREATE TABLE public.promo_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_code_id UUID REFERENCES public.promo_codes NOT NULL,
  used_by_email TEXT,
  used_by_phone TEXT,
  card_search_id UUID REFERENCES public.card_searches,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour l'historique d'utilisation
CREATE INDEX idx_promo_usage_promo_code_id ON public.promo_usage(promo_code_id);
CREATE INDEX idx_promo_usage_created_at ON public.promo_usage(created_at DESC);

-- Activer RLS sur les tables
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_usage ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour promo_codes
CREATE POLICY "Users can view their own promo codes" 
  ON public.promo_codes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own promo codes" 
  ON public.promo_codes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own promo codes" 
  ON public.promo_codes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politiques RLS pour promo_usage
CREATE POLICY "Users can view usage of their promo codes" 
  ON public.promo_usage 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.promo_codes pc 
      WHERE pc.id = promo_code_id 
      AND pc.user_id = auth.uid()
    )
  );

-- Fonction pour générer un code promo unique
CREATE OR REPLACE FUNCTION public.generate_promo_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $function$
DECLARE
  code_length INTEGER := 8;
  characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
  char_pos INTEGER;
BEGIN
  FOR i IN 1..code_length LOOP
    char_pos := floor(random() * length(characters) + 1);
    result := result || substr(characters, char_pos, 1);
  END LOOP;
  
  -- Vérifier que le code n'existe pas déjà
  WHILE EXISTS (SELECT 1 FROM public.promo_codes WHERE code = result) LOOP
    result := '';
    FOR i IN 1..code_length LOOP
      char_pos := floor(random() * length(characters) + 1);
      result := result || substr(characters, char_pos, 1);
    END LOOP;
  END LOOP;
  
  RETURN result;
END;
$function$;

-- Fonction pour mettre à jour les gains quand un code est utilisé
CREATE OR REPLACE FUNCTION public.update_promo_earnings()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Mettre à jour les statistiques du code promo
  UPDATE public.promo_codes 
  SET 
    usage_count = usage_count + 1,
    total_earnings = total_earnings + NEW.discount_amount
  WHERE id = NEW.promo_code_id;
  
  RETURN NEW;
END;
$function$;

-- Trigger pour mettre à jour automatiquement les gains
CREATE TRIGGER trigger_update_promo_earnings
  AFTER INSERT ON public.promo_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_promo_earnings();
