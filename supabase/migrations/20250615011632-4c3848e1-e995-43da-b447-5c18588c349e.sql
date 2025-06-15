
-- Table pour gérer les publicités entreprises créées par l’administration
CREATE TABLE public.admin_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL,
  message text,
  image_url text,
  target_url text,
  is_active boolean NOT NULL DEFAULT true,
  start_date date,
  end_date date
);

-- Activer la sécurité RLS
ALTER TABLE public.admin_ads ENABLE ROW LEVEL SECURITY;

-- Politique : seuls les admins peuvent gérer les publicités
CREATE POLICY "Admins can manage admin_ads"
  ON public.admin_ads
  FOR ALL
  TO authenticated
  USING (
    public.is_admin()
  )
  WITH CHECK (
    public.is_admin()
  );
