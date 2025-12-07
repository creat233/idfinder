-- Fonction pour mettre à jour les cartes expirées (subscription_expires_at passé)
CREATE OR REPLACE FUNCTION public.update_expired_mcards()
RETURNS TABLE(updated_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  count_updated INTEGER;
BEGIN
  -- Mettre à jour les cartes dont la date d'expiration est passée
  -- et qui sont encore marquées comme 'active' ou 'trial'
  UPDATE public.mcards
  SET 
    subscription_status = 'expired',
    is_published = false,
    updated_at = now()
  WHERE subscription_expires_at < now()
  AND subscription_status IN ('active', 'trial');
  
  GET DIAGNOSTICS count_updated = ROW_COUNT;
  
  RETURN QUERY SELECT count_updated;
END;
$$;

-- Accorder les permissions pour exécuter cette fonction
GRANT EXECUTE ON FUNCTION public.update_expired_mcards() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_expired_mcards() TO service_role;

-- Mettre à jour immédiatement les cartes actuellement expirées
UPDATE public.mcards
SET 
  subscription_status = 'expired',
  is_published = false,
  updated_at = now()
WHERE subscription_expires_at < now()
AND subscription_status IN ('active', 'trial');