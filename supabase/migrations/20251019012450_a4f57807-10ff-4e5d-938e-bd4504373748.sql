-- Update verification fee from 5000 to 6000 FCFA
ALTER TABLE public.mcard_verification_requests 
ALTER COLUMN verification_fee SET DEFAULT 6000;

-- Update any existing pending requests to 6000
UPDATE public.mcard_verification_requests 
SET verification_fee = 6000 
WHERE verification_fee = 5000 AND status = 'pending';