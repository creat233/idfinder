-- Activer l'extension pg_cron si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Créer un job cron qui s'exécute tous les jours à 9h00 UTC
-- pour envoyer automatiquement les rappels de renouvellement
SELECT cron.schedule(
  'send-renewal-reminders-daily',
  '0 9 * * *', -- Tous les jours à 9h00 UTC
  $$
  SELECT public.admin_send_renewal_notifications();
  $$
);

-- Log pour confirmer la création du job
DO $$
BEGIN
  RAISE NOTICE 'Job cron créé : envoi automatique des rappels de renouvellement tous les jours à 9h UTC';
END $$;