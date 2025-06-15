
-- Activer la sécurité au niveau des lignes pour la table des permissions
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Permettre aux administrateurs de voir toutes les permissions
CREATE POLICY "Admins can view permissions"
ON public.admin_permissions
FOR SELECT
USING (public.is_admin());

-- Permettre aux administrateurs d'ajouter de nouvelles permissions
CREATE POLICY "Admins can add permissions"
ON public.admin_permissions
FOR INSERT
WITH CHECK (public.is_admin());

-- Permettre aux administrateurs de mettre à jour les permissions existantes
CREATE POLICY "Admins can update permissions"
ON public.admin_permissions
FOR UPDATE
USING (public.is_admin());

-- Permettre aux administrateurs de supprimer des permissions
CREATE POLICY "Admins can delete permissions"
ON public.admin_permissions
FOR DELETE
USING (public.is_admin());
