-- Drop the existing check constraint that's causing the error
ALTER TABLE public.admin_messages DROP CONSTRAINT IF EXISTS admin_messages_priority_check;

-- Add a new constraint that accepts all priority values including 'medium'
ALTER TABLE public.admin_messages 
ADD CONSTRAINT admin_messages_priority_check 
CHECK (priority IN ('low', 'normal', 'medium', 'high', 'urgent'));