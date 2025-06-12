
-- Corriger la fonction admin_activate_promo_code pour éviter l'ambiguïté de colonnes
CREATE OR REPLACE FUNCTION public.admin_activate_promo_code(promo_code_text text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_email TEXT;
  code_exists BOOLEAN;
BEGIN
  -- Récupérer l'email de l'utilisateur actuel
  SELECT au.email INTO current_user_email
  FROM auth.users au
  WHERE au.id = auth.uid();
  
  -- Vérifier si l'utilisateur a la permission d'activer les codes
  IF NOT public.can_activate_promo_codes(current_user_email) THEN
    RAISE EXCEPTION 'Permission denied: Only authorized admins can activate promo codes';
  END IF;
  
  -- Vérifier si le code existe
  SELECT EXISTS (
    SELECT 1 FROM public.promo_codes pc
    WHERE pc.code = promo_code_text
  ) INTO code_exists;
  
  IF NOT code_exists THEN
    RAISE EXCEPTION 'Promo code not found';
  END IF;
  
  -- Activer le code
  UPDATE public.promo_codes 
  SET 
    is_active = true,
    is_paid = true
  WHERE code = promo_code_text;
  
  RETURN true;
END;
$function$
