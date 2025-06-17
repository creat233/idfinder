
-- Change the default trial period for new mCards to 1 month.
ALTER TABLE public.mcards
ALTER COLUMN subscription_expires_at SET DEFAULT (now() + interval '1 month');

-- Update existing trial mCards to have a 1 month trial period from their creation date.
UPDATE public.mcards
SET subscription_expires_at = created_at + interval '1 month'
WHERE subscription_status = 'trial';

