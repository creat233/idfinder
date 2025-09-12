-- Fix the remaining security issues found by the linter

-- 1. Remove security definer views and replace with safer alternatives
DROP VIEW IF EXISTS public.mcards_public;
DROP VIEW IF EXISTS public.mcard_reviews_public;

-- Instead, create functions that can be safely used
CREATE OR REPLACE FUNCTION public.get_public_mcard_data(p_slug text)
RETURNS TABLE(
  id uuid,
  slug text,
  full_name text,
  job_title text,
  company text,
  description text,
  profile_picture_url text,
  website_url text,
  linkedin_url text,
  twitter_url text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  tiktok_url text,
  snapchat_url text,
  telegram_url text,
  google_business_url text,
  maps_location_url text,
  view_count integer,
  is_verified boolean,
  verification_status text,
  plan text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    m.id,
    m.slug,
    m.full_name,
    m.job_title,
    m.company,
    m.description,
    m.profile_picture_url,
    m.website_url,
    m.linkedin_url,
    m.twitter_url,
    m.facebook_url,
    m.instagram_url,
    m.youtube_url,
    m.tiktok_url,
    m.snapchat_url,
    m.telegram_url,
    m.google_business_url,
    m.maps_location_url,
    m.view_count,
    m.is_verified,
    m.verification_status,
    m.plan,
    m.created_at
  FROM public.mcards m
  WHERE m.slug = p_slug AND m.is_published = true;
$$;

CREATE OR REPLACE FUNCTION public.get_public_reviews(p_mcard_id uuid)
RETURNS TABLE(
  id uuid,
  mcard_id uuid,
  visitor_name text,
  comment text,
  rating integer,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    r.id,
    r.mcard_id,
    r.visitor_name,
    r.comment,
    r.rating,
    r.created_at
  FROM public.mcard_reviews r
  WHERE r.mcard_id = p_mcard_id AND r.is_approved = true;
$$;

-- 2. Fix all remaining functions with missing search_path
CREATE OR REPLACE FUNCTION public.initialize_mcard_analytics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.mcard_analytics (mcard_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_reporter_phone()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Récupérer le numéro de téléphone du profil de l'utilisateur
  SELECT phone INTO NEW.reporter_phone 
  FROM profiles 
  WHERE id = NEW.reporter_id;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_card_found()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Cette fonction pourrait être étendue pour envoyer des notifications
  -- Pour l'instant, elle log juste l'événement
  RAISE LOG 'Carte trouvée: %', NEW.card_number;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_mcard_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Pour les nouveaux plans payants, s'assurer qu'ils ne sont pas publiés par défaut
  IF NEW.plan IN ('essential', 'premium') AND NEW.subscription_status = 'pending_payment' THEN
    NEW.is_published = false;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_public_ads()
RETURNS SETOF admin_ads
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.admin_ads
  WHERE
    is_active = true AND
    (start_date IS NULL OR start_date <= CURRENT_DATE) AND
    (end_date IS NULL OR end_date >= CURRENT_DATE)
  ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.is_user_blocked(p_mcard_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.mcard_blocked_users
    WHERE mcard_id = p_mcard_id 
    AND blocked_user_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.get_or_create_mcard_customization(p_mcard_id uuid)
RETURNS mcard_customization
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.mcard_customization;
BEGIN
  -- Essayer de récupérer la personnalisation existante
  SELECT * INTO result 
  FROM public.mcard_customization 
  WHERE mcard_id = p_mcard_id;
  
  -- Si elle n'existe pas, la créer
  IF result IS NULL THEN
    INSERT INTO public.mcard_customization (mcard_id)
    VALUES (p_mcard_id)
    RETURNING * INTO result;
  END IF;
  
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.deactivate_expired_promo_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Désactiver les codes expirés qui sont encore actifs
  UPDATE public.promo_codes 
  SET is_active = false
  WHERE expires_at < NOW() 
  AND is_active = true;
END;
$$;

-- Continue with more functions...
CREATE OR REPLACE FUNCTION public.get_daily_user_signups()
RETURNS TABLE(signup_date date, count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Vérifier si l'utilisateur est un administrateur
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  -- Retourner le nombre d'inscriptions par jour
  RETURN QUERY
  SELECT
    DATE(created_at) as signup_date,
    COUNT(id) as count
  FROM auth.users
  GROUP BY DATE(created_at)
  ORDER BY signup_date ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_activate_promo_code(promo_code_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;