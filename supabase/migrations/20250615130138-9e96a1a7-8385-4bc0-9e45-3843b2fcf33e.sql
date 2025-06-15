
ALTER TABLE public.mcards
ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'trial',
ADD COLUMN subscription_expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '27 days');

COMMENT ON COLUMN public.mcards.subscription_status IS 'Subscription status: trial, active, pending_payment, expired.';
COMMENT ON COLUMN public.mcards.subscription_expires_at IS 'When the current subscription for the mCard expires.';
