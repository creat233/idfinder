-- Corriger le problème de RLS sur les notifications lors de l'ajout de statuts
-- Le trigger notify_favorites_on_status_added ne peut pas insérer dans notifications à cause de RLS

-- Créer une fonction SECURITY DEFINER pour créer des notifications
CREATE OR REPLACE FUNCTION public.create_notification_secure(
  p_user_id UUID,
  p_card_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT
)
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (
    user_id,
    card_id,
    type,
    title,
    message,
    is_read
  ) VALUES (
    p_user_id,
    p_card_id,
    p_type,
    p_title,
    p_message,
    false
  );
END;
$$;

-- Mettre à jour le trigger pour utiliser la fonction sécurisée
CREATE OR REPLACE FUNCTION public.notify_favorites_on_status_added()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SET search_path TO 'public'
AS $$
DECLARE
  mcard_owner_name TEXT;
  favorite_user_id UUID;
  is_vacation BOOLEAN;
BEGIN
  -- Récupérer le nom du propriétaire de la carte
  SELECT full_name INTO mcard_owner_name
  FROM public.mcards 
  WHERE id = NEW.mcard_id;
  
  -- Envoyer une notification à tous les utilisateurs qui ont cette carte en favori
  FOR favorite_user_id IN 
    SELECT mf.user_id 
    FROM public.mcard_favorites mf
    LEFT JOIN public.profiles p ON p.id = mf.user_id
    WHERE mf.mcard_id = NEW.mcard_id
    AND (p.is_on_vacation IS NULL OR p.is_on_vacation = false)
  LOOP
    -- Utiliser la fonction sécurisée pour créer la notification
    PERFORM public.create_notification_secure(
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
$$;