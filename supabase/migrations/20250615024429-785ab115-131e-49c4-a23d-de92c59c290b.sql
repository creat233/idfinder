
-- On supprime les anciennes règles pour repartir sur une base propre
DROP POLICY IF EXISTS "Public can view active ads" ON public.admin_ads;
DROP POLICY IF EXISTS "Authenticated users can view ads" ON public.admin_ads;
DROP POLICY IF EXISTS "Admins can manage ads content" ON public.admin_ads;
DROP POLICY IF EXISTS "Admins can manage admin_ads" ON public.admin_ads;


-- Les visiteurs (non connectés) peuvent voir les publicités actives.
CREATE POLICY "Public can view active ads"
  ON public.admin_ads
  FOR SELECT
  TO anon
  USING (
    is_active = true AND
    (start_date IS NULL OR start_date <= CURRENT_DATE) AND
    (end_date IS NULL OR end_date >= CURRENT_DATE)
  );

-- Les utilisateurs connectés peuvent aussi voir les publicités.
CREATE POLICY "Authenticated users can view ads"
  ON public.admin_ads
  FOR SELECT
  TO authenticated
  USING (
    -- Les admins voient tout pour la gestion
    public.is_admin()
    -- Les autres utilisateurs connectés voient seulement les pubs actives
    OR (
      is_active = true AND
      (start_date IS NULL OR start_date <= CURRENT_DATE) AND
      (end_date IS NULL OR end_date >= CURRENT_DATE)
    )
  );

-- Seuls les administrateurs peuvent créer, modifier ou supprimer des publicités.
CREATE POLICY "Admins can manage ads"
  ON public.admin_ads
  FOR ALL -- ALL couvre INSERT, UPDATE, DELETE
  TO authenticated
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );

-- Cette fonction récupère uniquement les publicités publiques et sera utilisée par le bandeau.
-- SECURITY DEFINER permet de contourner les règles RLS pour s'assurer qu'elle retourne
-- TOUJOURS les publicités actives, même pour un admin.
CREATE OR REPLACE FUNCTION public.get_public_ads()
RETURNS SETOF public.admin_ads
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT *
  FROM public.admin_ads
  WHERE
    is_active = true AND
    (start_date IS NULL OR start_date <= CURRENT_DATE) AND
    (end_date IS NULL OR end_date >= CURRENT_DATE)
  ORDER BY created_at DESC;
$$;
