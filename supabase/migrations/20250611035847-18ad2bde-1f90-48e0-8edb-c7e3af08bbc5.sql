
-- Créer une table pour les permissions administratives
CREATE TABLE public.admin_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL UNIQUE,
  permission_type TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour optimiser les recherches
CREATE INDEX idx_admin_permissions_email ON public.admin_permissions(user_email);
CREATE INDEX idx_admin_permissions_type ON public.admin_permissions(permission_type);

-- Activer RLS sur la table
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour admin_permissions (seuls les admins peuvent voir/modifier)
CREATE POLICY "Only specific admin can view permissions" 
  ON public.admin_permissions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'mouhamed110000@gmail.com'
    )
  );

CREATE POLICY "Only specific admin can manage permissions" 
  ON public.admin_permissions 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'mouhamed110000@gmail.com'
    )
  );

-- Insérer la permission pour activer les codes promo
INSERT INTO public.admin_permissions (user_email, permission_type) 
VALUES ('mouhamed110000@gmail.com', 'activate_promo_codes');

-- Fonction pour vérifier les permissions d'activation de codes promo
CREATE OR REPLACE FUNCTION public.can_activate_promo_codes(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_permissions 
    WHERE admin_permissions.user_email = user_email 
    AND permission_type = 'activate_promo_codes' 
    AND is_active = true
  );
END;
$function$;

-- Fonction pour activer un code promo (réservée aux admins autorisés)
CREATE OR REPLACE FUNCTION public.admin_activate_promo_code(promo_code_text TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  current_user_email TEXT;
  code_exists BOOLEAN;
BEGIN
  -- Récupérer l'email de l'utilisateur actuel
  SELECT email INTO current_user_email
  FROM auth.users 
  WHERE id = auth.uid();
  
  -- Vérifier si l'utilisateur a la permission d'activer les codes
  IF NOT public.can_activate_promo_codes(current_user_email) THEN
    RAISE EXCEPTION 'Permission denied: Only authorized admins can activate promo codes';
  END IF;
  
  -- Vérifier si le code existe
  SELECT EXISTS (
    SELECT 1 FROM public.promo_codes 
    WHERE code = promo_code_text
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
$function$;
