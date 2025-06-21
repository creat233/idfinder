
-- Corriger la fonction de notification et le trigger pour les cartes signalées
CREATE OR REPLACE FUNCTION public.notify_card_owner()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  card_owner_id UUID;
  card_owner_name TEXT;
  is_vacation_mode BOOLEAN;
BEGIN
  -- Debug: Log de l'événement
  RAISE LOG 'Nouvelle carte signalée: numéro %, type %, signaleur %', NEW.card_number, NEW.document_type, NEW.reporter_id;
  
  -- Rechercher le propriétaire de la carte avec plus de détails de debug
  SELECT uc.user_id, p.first_name || ' ' || COALESCE(p.last_name, ''), COALESCE(p.is_on_vacation, false)
  INTO card_owner_id, card_owner_name, is_vacation_mode
  FROM public.user_cards uc
  JOIN public.profiles p ON p.id = uc.user_id
  WHERE uc.card_number = NEW.card_number 
  AND uc.is_active = true
  LIMIT 1;

  -- Debug: Log des résultats de recherche
  IF card_owner_id IS NOT NULL THEN
    RAISE LOG 'Propriétaire trouvé: ID %, nom %, vacances %', card_owner_id, card_owner_name, is_vacation_mode;
  ELSE
    RAISE LOG 'Aucun propriétaire trouvé pour la carte %', NEW.card_number;
  END IF;

  -- Si un propriétaire est trouvé ET qu'il n'est pas en vacances, créer une notification
  IF card_owner_id IS NOT NULL AND (is_vacation_mode IS NULL OR is_vacation_mode = false) THEN
    INSERT INTO public.notifications (
      user_id,
      reported_card_id,
      type,
      title,
      message
    ) VALUES (
      card_owner_id,
      NEW.id,
      'card_found',
      '🔍 Votre carte a été signalée !',
      'Excellente nouvelle ! Votre carte ' || NEW.document_type || ' avec le numéro ' || NEW.card_number || ' a été signalée comme trouvée sur FinderID. Recherchez ce numéro dans la barre de recherche pour voir les détails et confirmer la récupération.'
    );
    
    RAISE LOG 'Notification créée pour le propriétaire % de la carte %', card_owner_id, NEW.card_number;
  ELSIF card_owner_id IS NOT NULL AND is_vacation_mode = true THEN
    RAISE LOG 'Propriétaire en mode vacances, notification non envoyée pour la carte %', NEW.card_number;
  END IF;

  RETURN NEW;
END;
$$;

-- S'assurer que le déclencheur existe et fonctionne
DROP TRIGGER IF EXISTS trigger_notify_card_owner ON public.reported_cards;

CREATE TRIGGER trigger_notify_card_owner
  AFTER INSERT ON public.reported_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_card_owner();

-- Vérifier les cartes utilisateur pour le numéro 1234567890
SELECT 
  uc.id::text as id,
  uc.card_number,
  uc.user_id::text,
  uc.is_active::text,
  COALESCE(p.first_name, 'N/A') as first_name,
  COALESCE(p.last_name, 'N/A') as last_name,
  COALESCE(p.is_on_vacation::text, 'false') as is_on_vacation
FROM public.user_cards uc
LEFT JOIN public.profiles p ON p.id = uc.user_id
WHERE uc.card_number = '1234567890';

-- Vérifier les cartes signalées pour le numéro 1234567890
SELECT 
  rc.id::text as id,
  rc.card_number,
  rc.reporter_id::text,
  rc.status,
  rc.created_at::text,
  rc.document_type
FROM public.reported_cards rc
WHERE rc.card_number = '1234567890';

-- Vérifier les notifications existantes liées à ce numéro
SELECT 
  n.id::text as id,
  n.user_id::text,
  n.type,
  n.title,
  n.message,
  n.is_read::text,
  n.created_at::text
FROM public.notifications n
WHERE n.message LIKE '%1234567890%' 
OR n.reported_card_id IN (
  SELECT id FROM public.reported_cards WHERE card_number = '1234567890'
);
