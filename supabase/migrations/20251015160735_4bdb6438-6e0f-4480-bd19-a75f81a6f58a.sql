-- Supprimer et recréer la fonction trigger avec les bons noms de colonnes
DROP FUNCTION IF EXISTS public.create_admin_message_on_recovery() CASCADE;

CREATE OR REPLACE FUNCTION public.create_admin_message_on_recovery()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Vérifier si le statut change vers 'recovery_requested'
  IF NEW.status = 'recovery_requested' AND (OLD.status IS NULL OR OLD.status != 'recovery_requested') THEN
    INSERT INTO public.admin_messages (
      card_id,
      message_type,
      title,
      content,
      card_info,
      priority,
      status
    ) VALUES (
      NEW.id,
      'recovery_request',
      '🔍 Nouvelle demande de récupération',
      'Une nouvelle demande de récupération a été soumise pour la carte ' || NEW.card_number || '. Vérifiez les détails et traitez la demande.',
      jsonb_build_object(
        'card_number', NEW.card_number,
        'document_type', NEW.document_type,
        'location', NEW.location,
        'description', NEW.description,
        'recovery_final_price', NEW.recovery_final_price,
        'recovery_currency_symbol', NEW.recovery_currency_symbol
      ),
      'high',
      'unread'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recréer le trigger
DROP TRIGGER IF EXISTS trigger_create_admin_message_on_recovery ON public.reported_cards;

CREATE TRIGGER trigger_create_admin_message_on_recovery
  AFTER INSERT OR UPDATE ON public.reported_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.create_admin_message_on_recovery();