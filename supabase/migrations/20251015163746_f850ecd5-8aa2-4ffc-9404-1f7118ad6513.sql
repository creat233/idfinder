-- Créer une fonction pour envoyer des notifications aux cartes qui expirent aujourd'hui
CREATE OR REPLACE FUNCTION public.send_expiring_today_notifications()
RETURNS TABLE(success boolean, message text, notifications_sent integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  card_record RECORD;
  notification_count INTEGER := 0;
BEGIN
  -- Parcourir toutes les cartes qui expirent aujourd'hui
  FOR card_record IN 
    SELECT 
      m.id,
      m.user_id,
      m.full_name,
      m.plan,
      m.subscription_expires_at,
      p.is_on_vacation
    FROM public.mcards m
    LEFT JOIN public.profiles p ON p.id = m.user_id
    WHERE DATE(m.subscription_expires_at) = CURRENT_DATE
    AND m.subscription_status = 'active'
    AND m.plan IN ('essential', 'premium')
  LOOP
    -- Créer une notification seulement si l'utilisateur n'est pas en vacances
    IF card_record.is_on_vacation IS NULL OR card_record.is_on_vacation = false THEN
      INSERT INTO public.notifications (user_id, type, title, message)
      VALUES (
        card_record.user_id,
        'subscription_expiring_today',
        '⏰ Votre carte mCard expire aujourd''hui !',
        'Attention ! Votre carte "' || card_record.full_name || '" avec le plan ' || card_record.plan || 
        ' expire aujourd''hui. Renouvelez dès maintenant pour continuer à bénéficier de nos services sans interruption.'
      );
      notification_count := notification_count + 1;
    END IF;
  END LOOP;

  RETURN QUERY SELECT TRUE, 'Notifications envoyées avec succès', notification_count;
END;
$$;

-- Créer un job cron qui s'exécute tous les jours à 8h00 UTC
-- pour envoyer les notifications aux cartes qui expirent aujourd'hui
SELECT cron.schedule(
  'send-expiring-today-notifications',
  '0 8 * * *', -- Tous les jours à 8h00 UTC (1h avant les rappels de renouvellement)
  $$
  SELECT public.send_expiring_today_notifications();
  $$
);

-- Log pour confirmer la création du job
DO $$
BEGIN
  RAISE NOTICE 'Job cron créé : envoi automatique des notifications d''expiration aujourd''hui à 8h UTC';
END $$;