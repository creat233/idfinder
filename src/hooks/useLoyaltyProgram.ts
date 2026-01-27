import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LoyaltyProgram {
  id: string;
  isActive: boolean;
  pointsPerPurchase: number;
  pointsPerFavorite: number;
  pointsPerMessage: number;
}

interface LoyaltyReward {
  id: string;
  name: string;
  description: string | null;
  pointsRequired: number;
  rewardType: string;
  rewardValue: number;
  isActive: boolean;
  maxRedemptions: number | null;
  currentRedemptions: number;
}

interface CustomerPoints {
  id: string;
  customerId: string;
  totalPoints: number;
  lifetimePoints: number;
  customerName?: string;
  customerEmail?: string;
}

interface LoyaltyTransaction {
  id: string;
  customerId: string;
  points: number;
  transactionType: string;
  description: string | null;
  createdAt: string;
}

export const useLoyaltyProgram = (mcardId: string) => {
  const [program, setProgram] = useState<LoyaltyProgram | null>(null);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [customerPoints, setCustomerPoints] = useState<CustomerPoints[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProgram = useCallback(async () => {
    if (!mcardId) return;

    try {
      const { data, error } = await supabase
        .from('mcard_loyalty_programs')
        .select('*')
        .eq('mcard_id', mcardId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProgram({
          id: data.id,
          isActive: data.is_active,
          pointsPerPurchase: data.points_per_purchase,
          pointsPerFavorite: data.points_per_favorite,
          pointsPerMessage: data.points_per_message
        });
      }
    } catch (error) {
      console.error('Error fetching loyalty program:', error);
    }
  }, [mcardId]);

  const fetchRewards = useCallback(async () => {
    if (!mcardId) return;

    try {
      const { data, error } = await supabase
        .from('mcard_loyalty_rewards')
        .select('*')
        .eq('mcard_id', mcardId)
        .order('points_required', { ascending: true });

      if (error) throw error;

      setRewards((data || []).map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        pointsRequired: r.points_required,
        rewardType: r.reward_type,
        rewardValue: r.reward_value,
        isActive: r.is_active,
        maxRedemptions: r.max_redemptions,
        currentRedemptions: r.current_redemptions
      })));
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  }, [mcardId]);

  const fetchCustomerPoints = useCallback(async () => {
    if (!mcardId) return;

    try {
      const { data, error } = await supabase
        .from('mcard_loyalty_points')
        .select('*')
        .eq('mcard_id', mcardId)
        .order('total_points', { ascending: false });

      if (error) throw error;

      setCustomerPoints((data || []).map(p => ({
        id: p.id,
        customerId: p.customer_id,
        totalPoints: p.total_points,
        lifetimePoints: p.lifetime_points
      })));
    } catch (error) {
      console.error('Error fetching customer points:', error);
    }
  }, [mcardId]);

  const fetchTransactions = useCallback(async () => {
    if (!mcardId) return;

    try {
      const { data, error } = await supabase
        .from('mcard_loyalty_transactions')
        .select('*')
        .eq('mcard_id', mcardId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setTransactions((data || []).map(t => ({
        id: t.id,
        customerId: t.customer_id,
        points: t.points,
        transactionType: t.transaction_type,
        description: t.description,
        createdAt: t.created_at
      })));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [mcardId]);

  useEffect(() => {
    Promise.all([
      fetchProgram(),
      fetchRewards(),
      fetchCustomerPoints(),
      fetchTransactions()
    ]);
  }, [fetchProgram, fetchRewards, fetchCustomerPoints, fetchTransactions]);

  const createOrUpdateProgram = async (settings: Partial<LoyaltyProgram>) => {
    try {
      if (program) {
        const { error } = await supabase
          .from('mcard_loyalty_programs')
          .update({
            is_active: settings.isActive ?? program.isActive,
            points_per_purchase: settings.pointsPerPurchase ?? program.pointsPerPurchase,
            points_per_favorite: settings.pointsPerFavorite ?? program.pointsPerFavorite,
            points_per_message: settings.pointsPerMessage ?? program.pointsPerMessage,
            updated_at: new Date().toISOString()
          })
          .eq('id', program.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mcard_loyalty_programs')
          .insert({
            mcard_id: mcardId,
            is_active: settings.isActive ?? false,
            points_per_purchase: settings.pointsPerPurchase ?? 10,
            points_per_favorite: settings.pointsPerFavorite ?? 5,
            points_per_message: settings.pointsPerMessage ?? 2
          });

        if (error) throw error;
      }

      toast({
        title: 'Programme mis à jour',
        description: 'Les paramètres ont été enregistrés'
      });

      fetchProgram();
    } catch (error) {
      console.error('Error updating loyalty program:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le programme',
        variant: 'destructive'
      });
    }
  };

  const createReward = async (reward: Omit<LoyaltyReward, 'id' | 'currentRedemptions'>) => {
    try {
      const { error } = await supabase
        .from('mcard_loyalty_rewards')
        .insert({
          mcard_id: mcardId,
          name: reward.name,
          description: reward.description,
          points_required: reward.pointsRequired,
          reward_type: reward.rewardType,
          reward_value: reward.rewardValue,
          is_active: reward.isActive,
          max_redemptions: reward.maxRedemptions
        });

      if (error) throw error;

      toast({
        title: 'Récompense créée',
        description: `"${reward.name}" a été ajoutée`
      });

      fetchRewards();
    } catch (error) {
      console.error('Error creating reward:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la récompense',
        variant: 'destructive'
      });
    }
  };

  const updateReward = async (rewardId: string, updates: Partial<LoyaltyReward>) => {
    try {
      const { error } = await supabase
        .from('mcard_loyalty_rewards')
        .update({
          name: updates.name,
          description: updates.description,
          points_required: updates.pointsRequired,
          reward_type: updates.rewardType,
          reward_value: updates.rewardValue,
          is_active: updates.isActive,
          max_redemptions: updates.maxRedemptions,
          updated_at: new Date().toISOString()
        })
        .eq('id', rewardId);

      if (error) throw error;

      toast({
        title: 'Récompense mise à jour',
        description: 'Les modifications ont été enregistrées'
      });

      fetchRewards();
    } catch (error) {
      console.error('Error updating reward:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la récompense',
        variant: 'destructive'
      });
    }
  };

  const deleteReward = async (rewardId: string) => {
    try {
      const { error } = await supabase
        .from('mcard_loyalty_rewards')
        .delete()
        .eq('id', rewardId);

      if (error) throw error;

      toast({
        title: 'Récompense supprimée'
      });

      fetchRewards();
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la récompense',
        variant: 'destructive'
      });
    }
  };

  const refresh = useCallback(() => {
    fetchProgram();
    fetchRewards();
    fetchCustomerPoints();
    fetchTransactions();
  }, [fetchProgram, fetchRewards, fetchCustomerPoints, fetchTransactions]);

  return {
    program,
    rewards,
    customerPoints,
    transactions,
    loading,
    createOrUpdateProgram,
    createReward,
    updateReward,
    deleteReward,
    refresh
  };
};
