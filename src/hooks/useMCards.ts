import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MCard } from "@/types/mcard";
import { useAuthState } from "@/hooks/useAuthState";

export const useMCards = () => {
  const [mcards, setMCards] = useState<MCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthState();

  const fetchMCards = async () => {
    if (!user) {
      setMCards([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('mcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching MCards:', error);
        setError(error.message);
        setMCards([]);
      } else {
        setMCards(data || []);
      }
    } catch (err) {
      console.error('Error in fetchMCards:', err);
      setError('Une erreur inattendue s\'est produite');
      setMCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMCards();
  }, [user]);

  const createMCard = async (mcardData: Partial<MCard> & { full_name: string; slug: string }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('mcards')
        .insert({ ...mcardData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      
      await refetch();
      return data;
    } catch (error) {
      console.error('Error creating MCard:', error);
      throw error;
    }
  };

  const updateMCard = async (id: string, updates: Partial<MCard>) => {
    try {
      const { data, error } = await supabase
        .from('mcards')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      
      await refetch();
      return data;
    } catch (error) {
      console.error('Error updating MCard:', error);
      throw error;
    }
  };

  const deleteMCard = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('mcards')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      await refetch();
    } catch (error) {
      console.error('Error deleting MCard:', error);
      throw error;
    }
  };

  const requestPlanUpgrade = async (mcardId: string, newPlan: string) => {
    // Cette fonction peut être implémentée selon vos besoins
    // Pour l'instant, elle ne fait rien
    console.log('Plan upgrade requested for:', mcardId, 'to:', newPlan);
  };

  const refetch = () => {
    fetchMCards();
  };

  return {
    mcards,
    loading,
    error,
    refetch,
    createMCard,
    updateMCard,
    deleteMCard,
    requestPlanUpgrade
  };
};