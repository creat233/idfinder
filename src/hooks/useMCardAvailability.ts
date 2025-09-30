import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AvailabilitySlot {
  id?: string;
  mcard_id: string;
  day_of_week: number; // 0=Dimanche, 1=Lundi, etc.
  start_time: string; // Format HH:MM
  end_time: string; // Format HH:MM
  is_active: boolean;
}

const DAYS_OF_WEEK = [
  'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
];

export const useMCardAvailability = (mcardId: string) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadSlots = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mcard_availability_slots')
        .select('*')
        .eq('mcard_id', mcardId)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les créneaux horaires."
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSlot = async (slot: AvailabilitySlot) => {
    try {
      if (slot.id) {
        const { error } = await supabase
          .from('mcard_availability_slots')
          .update(slot)
          .eq('id', slot.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mcard_availability_slots')
          .insert(slot);
        if (error) throw error;
      }

      await loadSlots();
      toast({
        title: "Succès",
        description: "Créneau sauvegardé avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder le créneau."
      });
    }
  };

  const deleteSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('mcard_availability_slots')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      await loadSlots();
      toast({
        title: "Succès",
        description: "Créneau supprimé avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le créneau."
      });
    }
  };

  useEffect(() => {
    if (mcardId) {
      loadSlots();
    }
  }, [mcardId]);

  return {
    slots,
    loading,
    saveSlot,
    deleteSlot,
    loadSlots,
    DAYS_OF_WEEK
  };
};