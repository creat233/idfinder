
-- Function to create a notification when a new card is added by a user
CREATE OR REPLACE FUNCTION public.notify_on_new_card_added()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a notification for the user who added the card
  INSERT INTO public.notifications (user_id, type, title, message, is_read, card_id)
  VALUES (
    NEW.user_id,
    'card_added',
    '✅ Carte ajoutée !',
    'Votre carte (' || NEW.document_type || ') avec le numéro ' || NEW.card_number || ' a bien été ajoutée à votre liste de surveillance.',
    false,
    NEW.id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove existing trigger if it exists to prevent errors on re-run
DROP TRIGGER IF EXISTS on_new_card_added_trigger ON public.user_cards;

-- Trigger to execute the function after a new card is inserted
CREATE TRIGGER on_new_card_added_trigger
AFTER INSERT ON public.user_cards
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_new_card_added();
