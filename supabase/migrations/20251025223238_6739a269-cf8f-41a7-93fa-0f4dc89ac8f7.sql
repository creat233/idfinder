-- Supprimer l'ancienne fonction pour la recréer avec les bons champs
DROP FUNCTION IF EXISTS public.get_public_mcard_data(text);

-- Créer la nouvelle fonction get_public_mcard_data qui accepte slug ou ID
CREATE OR REPLACE FUNCTION public.get_public_mcard_data(p_slug text)
RETURNS TABLE (
  id uuid,
  user_id uuid,
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
  created_at timestamp with time zone,
  phone_number text,
  email text,
  subscription_status text,
  is_published boolean,
  social_links jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.user_id,
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
    m.created_at,
    m.phone_number,
    m.email,
    m.subscription_status,
    m.is_published,
    m.social_links
  FROM public.mcards m
  WHERE (m.slug = p_slug OR m.id::text = p_slug) 
    AND m.is_published = true 
    AND m.subscription_status = 'active';
END;
$$;