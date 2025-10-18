-- Ajouter la foreign key manquante pour mcard_reports -> mcards
ALTER TABLE public.mcard_reports
ADD CONSTRAINT mcard_reports_mcard_id_fkey 
FOREIGN KEY (mcard_id) 
REFERENCES public.mcards(id) 
ON DELETE CASCADE;