
-- Activer Row Level Security (RLS) si ce n’est pas déjà le cas
ALTER TABLE public.reported_cards ENABLE ROW LEVEL SECURITY;

-- Création d’une fonction utilitaire pour vérifier si l’utilisateur est admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_permissions
    WHERE user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Policy : Les admins peuvent modifier n’importe quelle carte
CREATE POLICY "Admins can update any card"
ON public.reported_cards
FOR UPDATE
USING (public.is_admin());

-- (à l’avenir : S’il faut restreindre aux statuts seulement, on peut affiner)
