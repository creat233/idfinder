
-- Met à jour la fonction is_admin pour la simplifier et éviter une boucle infinie
-- qui semble être la source des problèmes de chargement.
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_email = (SELECT auth.jwt() ->> 'email')
    AND is_active = true
  );
$function$;
