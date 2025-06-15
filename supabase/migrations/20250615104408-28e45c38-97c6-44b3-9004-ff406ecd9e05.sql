
-- Update the handle_new_user function to also create a welcome notification
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert profile for the new user
  INSERT INTO public.profiles (id, first_name, last_name, country)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    COALESCE(new.raw_user_meta_data ->> 'country', 'SN')
  );

  -- Insert a welcome notification for the new user
  INSERT INTO public.notifications (user_id, type, title, message, is_read)
  VALUES (
    new.id,
    'welcome',
    '👋 Bienvenue sur FinderID !',
    'Nous sommes ravis de vous compter parmi nous. Pensez à ajouter vos cartes pour être notifié si elles sont retrouvées.',
    false
  );

  RETURN new;
END;
$function$
