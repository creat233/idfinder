
ALTER TABLE public.mcards
ADD COLUMN plan TEXT NOT NULL DEFAULT 'free';

COMMENT ON COLUMN public.mcards.plan IS 'The subscription plan for the mCard (e.g., free, essential, premium).';

ALTER TABLE public.mcards
ADD CONSTRAINT mcards_plan_check CHECK (plan IN ('free', 'essential', 'premium'));
