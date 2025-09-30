-- Créer table pour les créneaux horaires des MCards
CREATE TABLE public.mcard_availability_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mcard_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Dimanche, 1=Lundi, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_mcard_availability_slots_mcard FOREIGN KEY (mcard_id) REFERENCES public.mcards(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.mcard_availability_slots ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Propriétaires peuvent gérer leurs créneaux"
ON public.mcard_availability_slots
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.mcards 
    WHERE mcards.id = mcard_availability_slots.mcard_id 
    AND mcards.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.mcards 
    WHERE mcards.id = mcard_availability_slots.mcard_id 
    AND mcards.user_id = auth.uid()
  )
);

CREATE POLICY "Visiteurs peuvent voir les créneaux des cartes publiées"
ON public.mcard_availability_slots
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.mcards 
    WHERE mcards.id = mcard_availability_slots.mcard_id 
    AND mcards.is_published = true
  )
);

-- Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER update_mcard_availability_slots_updated_at
  BEFORE UPDATE ON public.mcard_availability_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();