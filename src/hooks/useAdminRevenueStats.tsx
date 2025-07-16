
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';

interface RevenueStats {
  totalRevenue: number;
  recoveryRevenue: number;
  promoCodeSalesRevenue: number;
  mcardRevenue: number;
  recoveriesWithPromo: number;
  recoveriesWithoutPromo: number;
  paidPromoCodes: number;
  approvedMCards: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export const useAdminRevenueStats = () => {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchRevenueStats = async () => {
    try {
      setLoading(true);

      // Récupérer les cartes récupérées
      const { data: recoveredCards, error: cardsError } = await supabase
        .from('reported_cards')
        .select('id, promo_code_id')
        .eq('status', 'recovered');

      if (cardsError) throw cardsError;

      // Récupérer les codes promo payés
      const { count: paidPromoCodes, error: codesError } = await supabase
        .from('promo_codes')
        .select('*', { count: 'exact', head: true })
        .eq('is_paid', true);

      if (codesError) throw codesError;

      // Récupérer les mCards approuvées
      const { data: approvedMCards, error: mcardsError } = await supabase
        .from('mcards')
        .select('plan, created_at')
        .in('subscription_status', ['active']);

      if (mcardsError) throw mcardsError;

      const recoveriesWithPromo = recoveredCards.filter(c => c.promo_code_id).length;
      const recoveriesWithoutPromo = recoveredCards.length - recoveriesWithPromo;

      // Calculs de revenus de récupération
      const revenueFromRecoveriesWithoutPromo = recoveriesWithoutPromo * 5000;
      const revenueFromRecoveriesWithPromo = recoveriesWithPromo * 4000;
      const recoveryRevenue = revenueFromRecoveriesWithPromo + revenueFromRecoveriesWithoutPromo;

      // Revenus des codes promo
      const promoCodeSalesRevenue = (paidPromoCodes || 0) * 1000;
      
      // Revenus des mCards
      const mcardRevenue = approvedMCards.reduce((total, mcard) => {
        const price = mcard.plan === 'essential' ? 15000 : mcard.plan === 'premium' ? 30000 : 0;
        return total + price;
      }, 0);

      // Revenus par période
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfYear = new Date(today.getFullYear(), 0, 1);

      const dailyMCards = approvedMCards.filter(m => new Date(m.created_at) >= startOfDay);
      const monthlyMCards = approvedMCards.filter(m => new Date(m.created_at) >= startOfMonth);
      const yearlyMCards = approvedMCards.filter(m => new Date(m.created_at) >= startOfYear);

      const dailyRevenue = dailyMCards.reduce((total, mcard) => {
        const price = mcard.plan === 'essential' ? 15000 : mcard.plan === 'premium' ? 30000 : 0;
        return total + price;
      }, 0);

      const monthlyRevenue = monthlyMCards.reduce((total, mcard) => {
        const price = mcard.plan === 'essential' ? 15000 : mcard.plan === 'premium' ? 30000 : 0;
        return total + price;
      }, 0);

      const yearlyRevenue = yearlyMCards.reduce((total, mcard) => {
        const price = mcard.plan === 'essential' ? 15000 : mcard.plan === 'premium' ? 30000 : 0;
        return total + price;
      }, 0);

      const totalRevenue = recoveryRevenue + promoCodeSalesRevenue + mcardRevenue;

      setStats({
        totalRevenue,
        recoveryRevenue,
        promoCodeSalesRevenue,
        mcardRevenue,
        recoveriesWithPromo,
        recoveriesWithoutPromo,
        paidPromoCodes: paidPromoCodes || 0,
        approvedMCards: approvedMCards.length,
        dailyRevenue,
        monthlyRevenue,
        yearlyRevenue,
      });

    } catch (error: any) {
      showError('Erreur de calcul des revenus', error.message);
      console.error("Error fetching revenue stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueStats();
  }, []);

  return { stats, loading, refetch: fetchRevenueStats };
};
