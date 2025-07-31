-- Mettre à jour la fonction admin_get_all_mcards pour inclure toutes les informations utilisateur
DROP FUNCTION IF EXISTS public.admin_get_all_mcards();

CREATE OR REPLACE FUNCTION public.admin_get_all_mcards()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  full_name text,
  plan text,
  created_at timestamptz,
  user_email text,
  user_phone text,
  slug text,
  subscription_status text,
  subscription_expires_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    m.id,
    m.user_id,
    m.full_name,
    m.plan,
    m.created_at,
    COALESCE(u.email::text, 'Non disponible') AS user_email,
    COALESCE(p.phone, 'Non renseigné') AS user_phone,
    m.slug,
    m.subscription_status,
    m.subscription_expires_at
  FROM public.mcards m
  LEFT JOIN auth.users u ON m.user_id = u.id
  LEFT JOIN public.profiles p ON m.user_id = p.id
  -- Afficher toutes les cartes, triées par statut puis par date de création
  ORDER BY 
    CASE m.subscription_status
      WHEN 'pending_payment' THEN 1
      WHEN 'trial' THEN 2
      WHEN 'expired' THEN 3
      WHEN 'active' THEN 4
      ELSE 5
    END,
    m.created_at DESC;
END;
$$;