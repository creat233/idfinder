-- Supprimer la contrainte de clé étrangère restrictive sur card_id
ALTER TABLE public.admin_messages DROP CONSTRAINT IF EXISTS admin_messages_card_id_fkey;

-- card_id peut maintenant référencer différents types d'entités selon le message_type
-- On n'ajoute pas de nouvelle contrainte pour permettre plus de flexibilité

-- Fonction pour créer un message admin lors d'un signalement de mCard
CREATE OR REPLACE FUNCTION public.create_admin_message_on_mcard_report()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.status = 'pending' AND (OLD.status IS NULL OR OLD.status != 'pending') THEN
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
      'mcard_report',
      '⚠️ Signalement de mCard',
      'Une mCard a été signalée pour: ' || NEW.report_reason || '. Vérifiez les détails et prenez action.',
      jsonb_build_object(
        'mcard_id', NEW.mcard_id,
        'report_reason', NEW.report_reason,
        'report_description', NEW.report_description,
        'reporter_email', NEW.reporter_email
      ),
      'high',
      'unread'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger pour les signalements de mCard
DROP TRIGGER IF EXISTS trigger_create_admin_message_on_mcard_report ON public.mcard_reports;
CREATE TRIGGER trigger_create_admin_message_on_mcard_report
  AFTER INSERT OR UPDATE ON public.mcard_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.create_admin_message_on_mcard_report();

-- Fonction pour créer un message admin lors d'une demande de vérification
CREATE OR REPLACE FUNCTION public.create_admin_message_on_verification_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  mcard_name TEXT;
BEGIN
  IF NEW.status = 'pending' AND (OLD.status IS NULL OR OLD.status != 'pending') THEN
    -- Récupérer le nom de la mCard
    SELECT full_name INTO mcard_name FROM public.mcards WHERE id = NEW.mcard_id;
    
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
      'verification_request',
      '✓ Demande de vérification',
      'Nouvelle demande de vérification pour la mCard "' || COALESCE(mcard_name, 'N/A') || '". Vérifiez les documents soumis.',
      jsonb_build_object(
        'mcard_id', NEW.mcard_id,
        'mcard_name', mcard_name,
        'id_document_url', NEW.id_document_url,
        'ninea_document_url', NEW.ninea_document_url,
        'verification_fee', NEW.verification_fee
      ),
      'medium',
      'unread'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger pour les demandes de vérification
DROP TRIGGER IF EXISTS trigger_create_admin_message_on_verification ON public.mcard_verification_requests;
CREATE TRIGGER trigger_create_admin_message_on_verification
  AFTER INSERT OR UPDATE ON public.mcard_verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.create_admin_message_on_verification_request();

-- Créer les messages admin pour les événements existants
-- Signalements de mCard en attente
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
  mr.id,
  'mcard_report',
  '⚠️ Signalement de mCard',
  'Une mCard a été signalée pour: ' || mr.report_reason || '. Vérifiez les détails et prenez action.',
  jsonb_build_object(
    'mcard_id', mr.mcard_id,
    'report_reason', mr.report_reason,
    'report_description', mr.report_description,
    'reporter_email', mr.reporter_email
  ),
  'high',
  'unread',
  mr.created_at
FROM public.mcard_reports mr
WHERE mr.status = 'pending'
  AND NOT EXISTS (
    SELECT 1 
    FROM public.admin_messages am 
    WHERE am.card_id = mr.id 
      AND am.message_type = 'mcard_report'
  );

-- Demandes de vérification en attente
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
  vr.id,
  'verification_request',
  '✓ Demande de vérification',
  'Nouvelle demande de vérification pour la mCard "' || COALESCE(m.full_name, 'N/A') || '". Vérifiez les documents soumis.',
  jsonb_build_object(
    'mcard_id', vr.mcard_id,
    'mcard_name', m.full_name,
    'id_document_url', vr.id_document_url,
    'ninea_document_url', vr.ninea_document_url,
    'verification_fee', vr.verification_fee
  ),
  'medium',
  'unread',
  vr.created_at
FROM public.mcard_verification_requests vr
LEFT JOIN public.mcards m ON m.id = vr.mcard_id
WHERE vr.status = 'pending'
  AND NOT EXISTS (
    SELECT 1 
    FROM public.admin_messages am 
    WHERE am.card_id = vr.id 
      AND am.message_type = 'verification_request'
  );