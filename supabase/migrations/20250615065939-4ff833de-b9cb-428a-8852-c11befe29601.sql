
-- Active la sécurité au niveau des lignes pour les tables de promo
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_usage ENABLE ROW LEVEL SECURITY;

-- Supprime les anciennes policies au cas où pour éviter les conflits
DROP POLICY IF EXISTS "Admins can view all promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Admins can manage all promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Users can view their own promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Users can create their own promo codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Admins can view all promo usages" ON public.promo_usage;
DROP POLICY IF EXISTS "Admins can manage promo usages" ON public.promo_usage;

-- Crée les policies pour que les utilisateurs voient leurs propres codes
CREATE POLICY "Users can view their own promo codes"
ON public.promo_codes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own promo codes"
ON public.promo_codes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Crée les policies pour les admins sur la table promo_codes
CREATE POLICY "Admins can view all promo codes"
ON public.promo_codes FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can manage all promo codes"
ON public.promo_codes FOR ALL
USING (public.is_admin());

-- Crée les policies pour les admins sur la table promo_usage
CREATE POLICY "Admins can view all promo usages"
ON public.promo_usage FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can manage promo usages"
ON public.promo_usage FOR ALL
USING (public.is_admin());

-- Met à jour la fonction RPC pour utiliser is_admin() et corriger la récupération de l'email
CREATE OR REPLACE FUNCTION public.admin_get_all_promo_codes()
 RETURNS TABLE(id uuid, user_id uuid, code text, is_active boolean, is_paid boolean, created_at timestamp with time zone, expires_at timestamp with time zone, total_earnings numeric, usage_count integer, user_email text, user_name text, user_phone text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Utiliser la fonction is_admin() qui est plus fiable et centralisée
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;
  
  RETURN QUERY
  SELECT 
    pc.id,
    pc.user_id,
    pc.code,
    pc.is_active,
    pc.is_paid,
    pc.created_at,
    pc.expires_at,
    pc.total_earnings,
    pc.usage_count,
    -- Amélioration: Obtenir le vrai email de auth.users
    COALESCE(u.email, 'Non disponible') as user_email,
    COALESCE(p.first_name || ' ' || COALESCE(p.last_name, ''), 'Utilisateur') as user_name,
    COALESCE(p.phone, 'Non renseigné') as user_phone
  FROM public.promo_codes pc
  LEFT JOIN public.profiles p ON p.id = pc.user_id
  LEFT JOIN auth.users u ON u.id = pc.user_id -- Join pour récupérer l'email
  ORDER BY pc.created_at DESC;
END;
$function$;
