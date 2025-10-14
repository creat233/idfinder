import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MCardCustomization {
  id?: string;
  mcard_id: string;
  theme: string;
  animations_enabled: boolean;
  animation_speed: number;
  animation_type: string;
  particles_enabled: boolean;
  gradients_enabled: boolean;
  shadows_enabled: boolean;
  mask_enabled: boolean;
  custom_font: string;
}

export const useMCardCustomization = (mcardId: string) => {
  const [customization, setCustomization] = useState<MCardCustomization>({
    mcard_id: mcardId,
    theme: 'default',
    animations_enabled: false,
    animation_speed: 50,
    animation_type: 'fade',
    particles_enabled: false,
    gradients_enabled: true,
    shadows_enabled: true,
    mask_enabled: false,
    custom_font: 'Inter'
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCustomization();
  }, [mcardId]);

  const loadCustomization = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mcard_customization')
        .select('*')
        .eq('mcard_id', mcardId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCustomization({
          ...data,
          mask_enabled: data.mask_enabled ?? false
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la personnalisation:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCustomization = async (newCustomization: Partial<MCardCustomization>) => {
    try {
      const updatedCustomization = { ...customization, ...newCustomization };
      
      const { data, error } = await supabase
        .from('mcard_customization')
        .upsert(updatedCustomization)
        .select()
        .single();

      if (error) throw error;

      setCustomization({
        ...data,
        mask_enabled: data.mask_enabled ?? false
      });
      
      toast({
        title: "Paramètres sauvegardés !",
        description: "Vos modifications ont été appliquées avec succès."
      });

      return data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    customization,
    setCustomization,
    saveCustomization,
    loading
  };
};