-- Créer des messages admin pour toutes les demandes de récupération existantes
INSERT INTO public.admin_messages (
  card_id,
  message_type,
  title,
  content,
  card_info,
  priority,
  status,
  created_at
)
SELECT 
  rc.id,
  'recovery_request',
  '🔍 Nouvelle demande de récupération',
  'Une nouvelle demande de récupération a été soumise pour la carte ' || rc.card_number || '. Vérifiez les détails et traitez la demande.',
  jsonb_build_object(
    'card_number', rc.card_number,
    'document_type', rc.document_type,
    'location', rc.location,
    'description', rc.description,
    'recovery_final_price', rc.recovery_final_price,
    'recovery_currency_symbol', rc.recovery_currency_symbol
  ),
  'high',
  'unread',
  rc.created_at
FROM public.reported_cards rc
WHERE rc.status = 'recovery_requested'
  AND NOT EXISTS (
    SELECT 1 
    FROM public.admin_messages am 
    WHERE am.card_id = rc.id 
      AND am.message_type = 'recovery_request'
  );