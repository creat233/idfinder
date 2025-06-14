import { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { PromoCodeData, PromoCodeStats } from "@/types/promo";
import { AdminPromoService } from "@/services/adminPromoService";
import { calculatePromoStats, setupRealtimeSubscription } from "@/utils/adminPromoUtils";
import { supabase } from "@/integrations/supabase/client";

export const useAdminPromoData = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PromoCodeStats>({
    totalCodes: 0,
    activeCodes: 0,
    totalUsage: 0,
    totalEarnings: 0
  });
  const { showError } = useToast();

  const fetchPromoCodesData = async () => {
    try {
      setLoading(true);

      // Faire en sorte que usageCount et totalEarnings n’intègrent que les utilisations confirmées (is_paid = true)
      const enrichedCodes = await AdminPromoService.getAllPromoCodes();

      // Extra: charger les utilisations confirmées pour stats précises
      const { data: confirmedUsages, error: cuError } = await supabase
        .from("promo_usage")
        .select("promo_code_id, discount_amount")
        .eq("is_paid", true);

      // Map code id -> stats
      const statsMap: Record<string, { usage: number; earnings: number }> = {};
      (confirmedUsages || []).forEach((usage) => {
        if (!statsMap[usage.promo_code_id]) statsMap[usage.promo_code_id] = { usage: 0, earnings: 0 };
        statsMap[usage.promo_code_id].usage += 1;
        statsMap[usage.promo_code_id].earnings += Number(usage.discount_amount || 0);
      });

      // Injecter dans chaque code
      const promoCodesWithConfirmedStats = enrichedCodes.map(code => ({
        ...code,
        usage_count: statsMap[code.id]?.usage || 0,
        total_earnings: statsMap[code.id]?.earnings || 0
      }));

      setPromoCodes(promoCodesWithConfirmedStats);

      // Calculer les stats globales sur usages confirmés
      const calculatedStats = {
        totalCodes: promoCodesWithConfirmedStats.length,
        activeCodes: promoCodesWithConfirmedStats.filter(c => c.is_active).length,
        totalUsage: promoCodesWithConfirmedStats.reduce((acc, c) => acc + (c.usage_count || 0), 0),
        totalEarnings: promoCodesWithConfirmedStats.reduce((acc, c) => acc + (Number(c.total_earnings || 0)), 0)
      };
      setStats(calculatedStats);
    } catch (error: any) {
      console.error("💥 ERREUR GLOBALE (ADMIN):", error);
      showError("Erreur", `Impossible de récupérer les données des codes promo: ${error.message}`);
      setPromoCodes([]);
      setStats({
        totalCodes: 0,
        activeCodes: 0,
        totalUsage: 0,
        totalEarnings: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodesData();
    const unsubscribe = setupRealtimeSubscription(fetchPromoCodesData);
    return unsubscribe;
  }, []);

  return {
    promoCodes,
    loading,
    stats,
    refetch: fetchPromoCodesData
  };
};
