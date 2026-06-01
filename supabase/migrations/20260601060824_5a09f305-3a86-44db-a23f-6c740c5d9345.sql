CREATE TABLE public.hero_ab_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant text NOT NULL CHECK (variant IN ('vapor','sober')),
  event_type text NOT NULL CHECK (event_type IN ('impression','cta_click')),
  cta_label text,
  visitor_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  path text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX hero_ab_events_variant_event_idx ON public.hero_ab_events(variant, event_type, created_at DESC);
CREATE INDEX hero_ab_events_visitor_idx ON public.hero_ab_events(visitor_id);

GRANT SELECT, INSERT ON public.hero_ab_events TO anon;
GRANT SELECT, INSERT ON public.hero_ab_events TO authenticated;
GRANT ALL ON public.hero_ab_events TO service_role;

ALTER TABLE public.hero_ab_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_insert_hero_ab_events"
ON public.hero_ab_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "anyone_read_hero_ab_events"
ON public.hero_ab_events FOR SELECT
TO anon, authenticated
USING (true);