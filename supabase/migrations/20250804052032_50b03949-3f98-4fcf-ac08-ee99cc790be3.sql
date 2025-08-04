-- Créer le trigger pour automatiser la création de messages admin
CREATE TRIGGER trigger_create_admin_message_on_recovery
    AFTER UPDATE ON public.reported_cards
    FOR EACH ROW
    EXECUTE FUNCTION public.create_admin_message_on_recovery();