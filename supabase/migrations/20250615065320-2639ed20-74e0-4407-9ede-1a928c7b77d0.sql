
-- 1. Supprimer les anciennes politiques de sécurité (RLS) qui sont trop restrictives
DROP POLICY IF EXISTS "Only specific admin can view permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Only specific admin can manage permissions" ON public.admin_permissions;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to read audit logs" ON public.audit_logs;

-- 2. Créer de nouvelles politiques de sécurité qui autorisent les administrateurs
CREATE POLICY "Admins can view all permissions"
ON public.admin_permissions FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can manage all permissions"
ON public.admin_permissions FOR ALL
USING (public.is_admin());

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());

CREATE POLICY "Allow admins to read audit logs"
ON public.audit_logs FOR SELECT
USING (public.is_admin());

-- 3. Donner les permissions de lecture sur la table des utilisateurs au système
-- pour que les fonctions d'administration puissent récupérer les listes d'utilisateurs.
GRANT USAGE ON SCHEMA auth TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres;
