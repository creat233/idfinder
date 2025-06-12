
-- Ajouter les politiques RLS manquantes pour sécuriser l'application

-- Politiques pour promo_usage
CREATE POLICY "Users can view usage of their promo codes" 
  ON public.promo_usage 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.promo_codes pc 
      WHERE pc.id = promo_code_id 
      AND pc.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert promo usage" 
  ON public.promo_usage 
  FOR INSERT 
  WITH CHECK (true);

-- Politiques pour notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Politiques pour profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Politiques pour user_cards
CREATE POLICY "Users can view their own cards" 
  ON public.user_cards 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cards" 
  ON public.user_cards 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards" 
  ON public.user_cards 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politiques pour reported_cards
CREATE POLICY "Users can view reported cards" 
  ON public.reported_cards 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create card reports" 
  ON public.reported_cards 
  FOR INSERT 
  WITH CHECK (auth.uid() = reporter_id);

-- Politiques pour card_searches
CREATE POLICY "Anyone can search for cards" 
  ON public.card_searches 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view card searches" 
  ON public.card_searches 
  FOR SELECT 
  USING (true);

-- Améliorer la fonction admin pour traiter les erreurs de permissions
CREATE OR REPLACE FUNCTION public.admin_get_all_promo_codes()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  code text,
  is_active boolean,
  is_paid boolean,
  created_at timestamptz,
  expires_at timestamptz,
  total_earnings numeric,
  usage_count integer,
  user_email text,
  user_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Vérifier les permissions admin
  IF NOT public.can_activate_promo_codes((SELECT email FROM auth.users WHERE auth.users.id = auth.uid())) THEN
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
    COALESCE(p.first_name || '@finderid.com', 'user@finderid.com') as user_email,
    COALESCE(p.first_name || ' ' || p.last_name, 'Utilisateur') as user_name
  FROM public.promo_codes pc
  LEFT JOIN public.profiles p ON p.id = pc.user_id
  ORDER BY pc.created_at DESC;
END;
$$;
