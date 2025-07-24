-- Vérifier les types de notifications existants et nettoyer
UPDATE notifications SET type = 'card_found' WHERE type NOT IN ('card_found', 'product_added', 'status_added', 'message_received', 'verification_approved', 'verification_rejected');

-- Créer la table des favoris si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.mcard_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mcard_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, mcard_id)
);

-- Activer RLS pour les favoris
ALTER TABLE public.mcard_favorites ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les favoris (supprimer les anciennes si elles existent)
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.mcard_favorites;
DROP POLICY IF EXISTS "Users can add their own favorites" ON public.mcard_favorites;
DROP POLICY IF EXISTS "Users can remove their own favorites" ON public.mcard_favorites;

CREATE POLICY "Users can view their own favorites" 
ON public.mcard_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" 
ON public.mcard_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites" 
ON public.mcard_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Créer une fonction pour envoyer des notifications aux utilisateurs qui ont mis en favori une carte
CREATE OR REPLACE FUNCTION public.notify_favorites_on_product_added()
RETURNS TRIGGER AS $$
DECLARE
  mcard_owner_name TEXT;
  favorite_user_id UUID;
BEGIN
  -- Récupérer le nom du propriétaire de la carte
  SELECT full_name INTO mcard_owner_name
  FROM mcards 
  WHERE id = NEW.mcard_id;
  
  -- Envoyer une notification à tous les utilisateurs qui ont cette carte en favori
  FOR favorite_user_id IN 
    SELECT user_id 
    FROM mcard_favorites 
    WHERE mcard_id = NEW.mcard_id
  LOOP
    INSERT INTO notifications (
      user_id,
      card_id,
      type,
      title,
      message
    ) VALUES (
      favorite_user_id,
      NEW.mcard_id,
      'product_added',
      'Nouveau produit ajouté',
      mcard_owner_name || ' a ajouté un nouveau produit : ' || NEW.name
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour les notifications de nouveaux produits
DROP TRIGGER IF EXISTS trigger_notify_favorites_on_product_added ON mcard_products;
CREATE TRIGGER trigger_notify_favorites_on_product_added
  AFTER INSERT ON mcard_products
  FOR EACH ROW
  EXECUTE FUNCTION notify_favorites_on_product_added();

-- Créer une fonction pour envoyer des notifications quand une carte publie un nouveau statut
CREATE OR REPLACE FUNCTION public.notify_favorites_on_status_added()
RETURNS TRIGGER AS $$
DECLARE
  mcard_owner_name TEXT;
  favorite_user_id UUID;
BEGIN
  -- Récupérer le nom du propriétaire de la carte
  SELECT full_name INTO mcard_owner_name
  FROM mcards 
  WHERE id = NEW.mcard_id;
  
  -- Envoyer une notification à tous les utilisateurs qui ont cette carte en favori
  FOR favorite_user_id IN 
    SELECT user_id 
    FROM mcard_favorites 
    WHERE mcard_id = NEW.mcard_id
  LOOP
    INSERT INTO notifications (
      user_id,
      card_id,
      type,
      title,
      message
    ) VALUES (
      favorite_user_id,
      NEW.mcard_id,
      'status_added',
      'Nouveau statut publié',
      mcard_owner_name || ' a publié un nouveau statut : ' || LEFT(NEW.status_text, 50) || 
      CASE WHEN LENGTH(NEW.status_text) > 50 THEN '...' ELSE '' END
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour les notifications de nouveaux statuts
DROP TRIGGER IF EXISTS trigger_notify_favorites_on_status_added ON mcard_statuses;
CREATE TRIGGER trigger_notify_favorites_on_status_added
  AFTER INSERT ON mcard_statuses
  FOR EACH ROW
  EXECUTE FUNCTION notify_favorites_on_status_added();

-- Ajouter la colonne action_url si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' 
    AND column_name = 'action_url'
  ) THEN
    ALTER TABLE notifications ADD COLUMN action_url TEXT;
  END IF;
END $$;

-- Créer des index pour les performances
CREATE INDEX IF NOT EXISTS idx_mcard_favorites_user_id ON mcard_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_mcard_favorites_mcard_id ON mcard_favorites(mcard_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);