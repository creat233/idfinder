import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LoyaltyActionType {
  type: 'favorite' | 'like' | 'share' | 'review' | 'product_like' | 'save' | 'message';
  label: string;
  icon: string;
  productId?: string;
}

export interface CompletedAction {
  actionType: string;
  productId?: string;
  pointsEarned: number;
  createdAt: string;
}

export const useLoyaltyActions = (mcardId: string) => {
  const [completedActions, setCompletedActions] = useState<CompletedAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [programActive, setProgramActive] = useState(false);
  const { toast } = useToast();

  const fetchCompletedActions = useCallback(async () => {
    if (!mcardId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if program is active
      const { data: program } = await supabase
        .from('mcard_loyalty_programs')
        .select('is_active')
        .eq('mcard_id', mcardId)
        .single();

      setProgramActive(program?.is_active ?? false);

      // Fetch completed actions
      const { data, error } = await supabase
        .from('mcard_loyalty_actions')
        .select('*')
        .eq('mcard_id', mcardId)
        .eq('customer_id', user.id);

      if (error) throw error;

      setCompletedActions((data || []).map(a => ({
        actionType: a.action_type,
        productId: a.product_id,
        pointsEarned: a.points_earned,
        createdAt: a.created_at
      })));
    } catch (error) {
      console.error('Error fetching loyalty actions:', error);
    } finally {
      setLoading(false);
    }
  }, [mcardId]);

  useEffect(() => {
    fetchCompletedActions();
  }, [fetchCompletedActions]);

  const isActionCompleted = useCallback((actionType: string, productId?: string) => {
    return completedActions.some(a => 
      a.actionType === actionType && 
      (productId ? a.productId === productId : !a.productId)
    );
  }, [completedActions]);

  const awardPoints = async (actionType: string, productId?: string): Promise<{ success: boolean; pointsEarned?: number; message?: string }> => {
    if (!programActive) {
      return { success: false, message: 'Programme de fidélité non actif' };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, message: 'Connectez-vous pour gagner des points' };
      }

      const { data, error } = await supabase.rpc('award_loyalty_points', {
        p_mcard_id: mcardId,
        p_customer_id: user.id,
        p_action_type: actionType,
        p_product_id: productId || null
      });

      if (error) throw error;

      const result = data as { success: boolean; points_earned?: number; message?: string; already_done?: boolean };

      if (result.success) {
        toast({
          title: '🎉 Points gagnés !',
          description: `+${result.points_earned} points ajoutés à votre compte fidélité`
        });

        // Refresh completed actions
        await fetchCompletedActions();

        return { success: true, pointsEarned: result.points_earned };
      } else if (result.already_done) {
        return { success: false, message: 'Action déjà effectuée' };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error awarding points:', error);
      return { success: false, message: 'Erreur lors de l\'attribution des points' };
    }
  };

  return {
    completedActions,
    loading,
    programActive,
    isActionCompleted,
    awardPoints,
    refresh: fetchCompletedActions
  };
};
