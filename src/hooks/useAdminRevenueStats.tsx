
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';

interface RevenueStats {
  totalRevenue: number;
  recoveryRevenue: number;
  promoCodeSalesRevenue: number;
  recoveriesWithPromo: number;
  recoveriesWithoutPromo: number;
  paidPromoCodes: number;
}

export const useAdminRevenueStats = () => {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchRevenueStats = async () => {
    try {
      setLoading(true);

      const { data: recoveredCards, error: cardsError } = await supabase
        .from('reported_cards')
        .select('id, promo_code_id')
        .eq('status', 'recovered');

      if (cardsError) throw cardsError;

      const { count: paidPromoCodes, error: codesError } = await supabase
        .from('promo_codes')
        .select('*', { count: 'exact', head: true })
        .eq('is_paid', true);

      if (codesError) throw codesError;

      const recoveriesWithPromo = recoveredCards.filter(c => c.promo_code_id).length;
      const recoveriesWithoutPromo = recoveredCards.length - recoveriesWithPromo;

      // Revenu net: 5000 FCFA sans promo (7000 - 2000)
      const revenueFromRecoveriesWithoutPromo = recoveriesWithoutPromo * 5000;
      // Revenu net: 4000 FCFA avec promo (7000 - 2000 - 1000)
      const revenueFromRecoveriesWithPromo = recoveriesWithPromo * 4000;
      
      const recoveryRevenue = revenueFromRecoveriesWithPromo + revenueFromRecoveriesWithoutPromo;

      const promoCodeSalesRevenue = (paidPromoCodes || 0) * 1000;
      
      const totalRevenue = recoveryRevenue + promoCodeSalesRevenue;

      setStats({
        totalRevenue,
        recoveryRevenue,
        promoCodeSalesRevenue,
        recoveriesWithPromo,
        recoveriesWithoutPromo,
        paidPromoCodes: paidPromoCodes || 0,
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
