-- Mise à jour du système de plans pour supporter le plan gratuit activé automatiquement

-- Modifier la fonction pour permettre la création automatique de cartes gratuites
CREATE OR REPLACE FUNCTION public.handle_new_mcard_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Les cartes gratuites sont publiées et activées automatiquement
  IF NEW.plan = 'free' THEN
    NEW.is_published = true;
    NEW.subscription_status = 'active';
    NEW.subscription_expires_at = NULL; -- Pas de date d'expiration pour le plan gratuit
  -- Pour les plans payants, ne pas publier par défaut
  ELSIF NEW.plan IN ('essential', 'premium') AND NEW.subscription_status = 'pending_payment' THEN
    NEW.is_published = false;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Ajouter des commentaires pour documenter les restrictions du plan gratuit
COMMENT ON FUNCTION public.handle_new_mcard_creation() IS 
'Gère la création de nouvelles mCards. Les cartes gratuites sont activées automatiquement sans expiration.
Les plans payants nécessitent un paiement avant publication.';

-- Mettre à jour les limites de plan pour le plan gratuit dans les commentaires
COMMENT ON TABLE public.mcard_statuses IS 
'Statuts des mCards. Restrictions par plan:
- Gratuit: 0 statuts autorisés
- Essentiel: 15 statuts/jour max
- Premium: 30 statuts/jour max';

COMMENT ON TABLE public.mcard_products IS 
'Produits et services des mCards. Restrictions par plan:
- Gratuit: 0 produits autorisés
- Essentiel: 20 produits max
- Premium: 50 produits max';

COMMENT ON TABLE public.mcard_invoices IS 
'Factures professionnelles. Disponible uniquement pour:
- Essentiel: Gestion de factures
- Premium: Gestion de factures + modèles personnalisés';
