-- Créer la table des campagnes marketing
CREATE TABLE public.mcard_marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mcard_id UUID NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  campaign_type TEXT NOT NULL DEFAULT 'promotion', -- promotion, announcement, event, reminder
  status TEXT NOT NULL DEFAULT 'draft', -- draft, scheduled, sent, cancelled
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipients_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.mcard_marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- Policies RLS
CREATE POLICY "Users can manage their own campaigns"
ON public.mcard_marketing_campaigns FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.mcards 
  WHERE mcards.id = mcard_marketing_campaigns.mcard_id 
  AND mcards.user_id = auth.uid()
));

-- Trigger pour updated_at
CREATE TRIGGER update_mcard_marketing_campaigns_updated_at
BEFORE UPDATE ON public.mcard_marketing_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour récupérer les emails des utilisateurs qui ont favorisé une MCard
CREATE OR REPLACE FUNCTION public.get_mcard_favorite_emails(p_mcard_id UUID)
RETURNS TABLE(user_id UUID, email TEXT, first_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Vérifier que l'utilisateur est propriétaire de la MCard
  IF NOT EXISTS (
    SELECT 1 FROM public.mcards 
    WHERE id = p_mcard_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Permission denied: You do not own this MCard';
  END IF;

  RETURN QUERY
  SELECT 
    mf.user_id,
    u.email::TEXT,
    COALESCE(p.first_name, 'Client') as first_name
  FROM public.mcard_favorites mf
  JOIN auth.users u ON u.id = mf.user_id
  LEFT JOIN public.profiles p ON p.id = mf.user_id
  WHERE mf.mcard_id = p_mcard_id;
END;
$$;