-- Fix the final batch of functions missing search_path

CREATE OR REPLACE FUNCTION public.admin_get_all_users()
RETURNS TABLE(id uuid, email text, created_at timestamp with time zone, first_name text, last_name text, phone text, country text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::text, -- Conversion explicite pour éviter les erreurs de type
    u.created_at,
    p.first_name,
    p.last_name,
    p.phone,
    p.country
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  ORDER BY u.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_deactivate_mcard(p_mcard_id uuid)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mcard public.mcards;
  v_notification_title text;
  v_notification_message text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  -- Get the mCard details
  SELECT * INTO v_mcard FROM public.mcards WHERE id = p_mcard_id;

  IF v_mcard IS NULL THEN
    RETURN QUERY SELECT false, 'mCard not found.';
    RETURN;
  END IF;

  -- Update the mCard to deactivate it
  UPDATE public.mcards
  SET
    subscription_status = 'expired',
    is_published = false,
    updated_at = now()
  WHERE id = p_mcard_id;

  -- Prepare notification
  v_notification_title := '⚠️ Votre carte mCard a été désactivée';
  v_notification_message := 'Votre carte "' || v_mcard.full_name || '" a été désactivée par l''administration. Contactez-nous pour plus d''informations.';

  -- Insert notification for the user
  INSERT INTO public.notifications (user_id, type, title, message, is_read)
  VALUES (v_mcard.user_id, 'mcard_deactivated', v_notification_title, v_notification_message, false);

  -- Log the deactivation in audit logs
  INSERT INTO public.audit_logs (action, user_email, details)
  VALUES (
    'mcard_deactivated',
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    jsonb_build_object(
      'mcard_id', p_mcard_id,
      'mcard_name', v_mcard.full_name,
      'plan', v_mcard.plan,
      'user_id', v_mcard.user_id
    )
  );

  RETURN QUERY SELECT true, 'Carte désactivée avec succès.';
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_approve_mcard_verification(p_request_id uuid)
RETURNS TABLE(success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request public.mcard_verification_requests;
  v_mcard public.mcards;
BEGIN
  -- Vérifier les permissions admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Admin access required';
  END IF;

  -- Récupérer la demande
  SELECT * INTO v_request FROM public.mcard_verification_requests WHERE id = p_request_id;
  
  IF v_request IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Demande non trouvée.';
    RETURN;
  END IF;

  -- Récupérer la MCard
  SELECT * INTO v_mcard FROM public.mcards WHERE id = v_request.mcard_id;

  -- Approuver la vérification
  UPDATE public.mcard_verification_requests
  SET 
    status = 'approved',
    processed_by = auth.uid(),
    processed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_request_id;

  -- Marquer la MCard comme vérifiée
  UPDATE public.mcards
  SET 
    is_verified = TRUE,
    verification_status = 'verified',
    updated_at = NOW()
  WHERE id = v_request.mcard_id;

  -- Créer une notification pour l'utilisateur
  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (
    v_request.user_id,
    'verification_approved',
    '✅ Vérification approuvée !',
    'Félicitations ! Votre MCard "' || v_mcard.full_name || '" a été vérifiée avec succès. Le badge "Vérifié" est maintenant visible sur votre carte.'
  );

  RETURN QUERY SELECT TRUE, 'Vérification approuvée avec succès.';
END;
$$;

CREATE OR REPLACE FUNCTION public.update_mcard_analytics_on_interaction()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Incrémenter le compteur approprié
    IF NEW.interaction_type = 'like' THEN
      UPDATE public.mcard_analytics
      SET likes_count = likes_count + 1
      WHERE mcard_id = NEW.mcard_id;
    ELSIF NEW.interaction_type = 'favorite' THEN
      UPDATE public.mcard_analytics
      SET favorites_count = favorites_count + 1
      WHERE mcard_id = NEW.mcard_id;
    ELSIF NEW.interaction_type = 'share' THEN
      UPDATE public.mcard_analytics
      SET shares_count = shares_count + 1
      WHERE mcard_id = NEW.mcard_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    -- Décrémenter le compteur approprié
    IF OLD.interaction_type = 'like' THEN
      UPDATE public.mcard_analytics
      SET likes_count = GREATEST(0, likes_count - 1)
      WHERE mcard_id = OLD.mcard_id;
    ELSIF OLD.interaction_type = 'favorite' THEN
      UPDATE public.mcard_analytics
      SET favorites_count = GREATEST(0, favorites_count - 1)
      WHERE mcard_id = OLD.mcard_id;
    ELSIF OLD.interaction_type = 'share' THEN
      UPDATE public.mcard_analytics
      SET shares_count = GREATEST(0, shares_count - 1)
      WHERE mcard_id = OLD.mcard_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_on_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recipient_vacation_mode BOOLEAN;
  sender_name TEXT;
BEGIN
  -- Vérifier le mode vacances du destinataire
  SELECT p.is_on_vacation INTO recipient_vacation_mode
  FROM public.profiles p
  WHERE p.id = NEW.recipient_id;

  -- Récupérer le nom de l'expéditeur
  SELECT COALESCE(p.first_name || ' ' || COALESCE(p.last_name, ''), 'Utilisateur')
  INTO sender_name
  FROM public.profiles p
  WHERE p.id = NEW.sender_id;

  -- Créer une notification seulement si le destinataire n'est pas en vacances
  IF recipient_vacation_mode IS NULL OR recipient_vacation_mode = false THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      is_read
    ) VALUES (
      NEW.recipient_id,
      'new_message',
      '💬 Nouveau message reçu',
      'Vous avez reçu un message de ' || sender_name || 
      CASE WHEN NEW.subject IS NOT NULL THEN ' - Sujet: ' || NEW.subject ELSE '' END,
      false
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Continue with remaining functions...
CREATE OR REPLACE FUNCTION public.notify_expired_promo_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expired_code RECORD;
BEGIN
  -- Récupérer tous les codes expirés qui sont encore marqués comme actifs
  FOR expired_code IN 
    SELECT pc.id, pc.code, pc.user_id, p.is_on_vacation
    FROM public.promo_codes pc
    LEFT JOIN public.profiles p ON p.id = pc.user_id
    WHERE pc.expires_at < NOW() 
    AND pc.is_active = true
  LOOP
    -- Désactiver le code
    UPDATE public.promo_codes 
    SET is_active = false 
    WHERE id = expired_code.id;
    
    -- Créer une notification seulement si l'utilisateur n'est pas en vacances
    IF expired_code.is_on_vacation IS NULL OR expired_code.is_on_vacation = false THEN
      INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        is_read
      ) VALUES (
        expired_code.user_id,
        'promo_expired',
        '⏰ Code promo expiré',
        'Votre code promo "' || expired_code.code || '" a expiré et a été automatiquement désactivé. Vous pouvez créer un nouveau code promo depuis votre tableau de bord.',
        false
      );
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_promo_code_expiry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si on essaie d'activer un code qui est expiré, l'empêcher
  IF NEW.is_active = true AND NEW.expires_at < NOW() THEN
    RAISE EXCEPTION 'Cannot activate expired promo code. Code expired on %', NEW.expires_at;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_all_mcards()
RETURNS TABLE(id uuid, user_id uuid, full_name text, plan text, created_at timestamp with time zone, user_email text, user_phone text, slug text, subscription_status text, subscription_expires_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.increment_mcard_view_count(mcard_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.mcards
  SET view_count = view_count + 1
  WHERE slug = mcard_slug AND is_published = true;
END;
$$;