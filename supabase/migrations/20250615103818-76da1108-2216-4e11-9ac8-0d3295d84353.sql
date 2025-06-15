
-- Add a column to link promo usage to a specific reported card recovery
ALTER TABLE public.promo_usage
ADD COLUMN IF NOT EXISTS reported_card_id UUID REFERENCES public.reported_cards(id) ON DELETE SET NULL;

-- Remove existing triggers if they exist to prevent errors on re-run
DROP TRIGGER IF EXISTS on_recovery_status_update ON public.reported_cards;
DROP TRIGGER IF EXISTS on_promo_payment_processed ON public.promo_usage;

-- Function to notify card owner on recovery status changes
CREATE OR REPLACE FUNCTION public.notify_owner_on_recovery_update()
RETURNS TRIGGER AS $$
DECLARE
  card_owner_id UUID;
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Only trigger if status has changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Find the card owner from the user_cards table
    SELECT uc.user_id
    INTO card_owner_id
    FROM public.user_cards uc
    WHERE uc.card_number = NEW.card_number
    AND uc.is_active = true
    LIMIT 1;

    -- If an owner is found, prepare a notification based on the new status
    IF card_owner_id IS NOT NULL THEN
      IF NEW.status = 'recovery_confirmed' THEN
        notification_title := '✅ Récupération confirmée';
        notification_message := 'Bonne nouvelle ! La récupération de votre carte ' || NEW.card_number || ' a été confirmée. Nous vous contacterons bientôt pour la remise.';
      ELSIF NEW.status = 'completed' THEN
        notification_title := '🎉 Carte récupérée !';
        notification_message := 'Félicitations ! Votre carte ' || NEW.card_number || ' a été marquée comme récupérée. Merci d''utiliser FinderID !';
      ELSIF NEW.status = 'cancelled' THEN
        notification_title := '❌ Récupération annulée';
        notification_message := 'La procédure de récupération pour la carte ' || NEW.card_number || ' a été annulée.';
      END IF;

      -- Insert notification if a title was set (i.e., for a relevant status change)
      IF notification_title IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, reported_card_id, type, title, message, is_read)
        VALUES (card_owner_id, NEW.id, 'recovery_update', notification_title, notification_message, false);
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for recovery status updates
CREATE TRIGGER on_recovery_status_update
AFTER UPDATE ON public.reported_cards
FOR EACH ROW
EXECUTE FUNCTION public.notify_owner_on_recovery_update();


-- Function to notify promo code owner when their code usage is paid
CREATE OR REPLACE FUNCTION public.notify_promo_owner_on_payment()
RETURNS TRIGGER AS $$
DECLARE
  promo_owner_id UUID;
  promo_code_text TEXT;
BEGIN
  -- Only trigger if 'is_paid' has been changed to true
  IF NEW.is_paid = true AND (OLD.is_paid IS NULL OR OLD.is_paid = false) THEN
    -- Get promo code owner's user_id and the code itself
    SELECT pc.user_id, pc.code
    INTO promo_owner_id, promo_code_text
    FROM public.promo_codes pc
    WHERE pc.id = NEW.promo_code_id;

    -- If owner is found, create a notification
    IF promo_owner_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, reported_card_id, type, title, message, is_read)
      VALUES (
        promo_owner_id,
        NEW.reported_card_id, -- Link to the card recovery
        'promo_payment_received',
        '💸 Paiement reçu !',
        'Vous avez reçu un paiement de 1000 FCFA pour l''utilisation de votre code promo ' || promo_code_text || '. Merci de votre contribution !',
        false
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for promo usage payments
CREATE TRIGGER on_promo_payment_processed
AFTER UPDATE ON public.promo_usage
FOR EACH ROW
EXECUTE FUNCTION public.notify_promo_owner_on_payment();
