
-- Ajouter les colonnes telegram_url et google_business_url à la table mcards
ALTER TABLE public.mcards 
ADD COLUMN telegram_url text,
ADD COLUMN google_business_url text;

-- Créer une table pour les avis des visiteurs
CREATE TABLE public.mcard_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mcard_id UUID NOT NULL,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter les politiques RLS pour les avis
ALTER TABLE public.mcard_reviews ENABLE ROW LEVEL SECURITY;

-- Politique pour que tout le monde puisse voir les avis approuvés
CREATE POLICY "Anyone can view approved reviews" 
  ON public.mcard_reviews 
  FOR SELECT 
  USING (is_approved = true);

-- Politique pour que tout le monde puisse créer des avis
CREATE POLICY "Anyone can create reviews" 
  ON public.mcard_reviews 
  FOR INSERT 
  WITH CHECK (true);

-- Politique pour que les propriétaires puissent voir tous leurs avis
CREATE POLICY "Owners can view all their reviews" 
  ON public.mcard_reviews 
  FOR SELECT 
  USING (
    mcard_id IN (
      SELECT id FROM public.mcards WHERE user_id = auth.uid()
    )
  );

-- Politique pour que les propriétaires puissent approuver leurs avis
CREATE POLICY "Owners can update their reviews" 
  ON public.mcard_reviews 
  FOR UPDATE 
  USING (
    mcard_id IN (
      SELECT id FROM public.mcards WHERE user_id = auth.uid()
    )
  );

-- Ajouter un trigger pour mettre à jour updated_at
CREATE TRIGGER update_mcard_reviews_updated_at
  BEFORE UPDATE
  ON public.mcard_reviews
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();
