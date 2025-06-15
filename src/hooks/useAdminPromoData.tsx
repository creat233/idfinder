
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { PromoCodeData, PromoCodeStats } from "@/types/promo";
import { AdminPromoService } from "@/services/adminPromoService";
import { setupRealtimeSubscription } from "@/utils/adminPromoUtils";

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

      // Le service retourne maintenant les codes avec des statistiques correctes et fiables.
      const codes = await AdminPromoService.getAllPromoCodes();
      setPromoCodes(codes);

      // On peut maintenant calculer les stats globales directement depuis ces données fiables.
      const calculatedStats = {
        totalCodes: codes.length,
        activeCodes: codes.filter(c => c.is_active).length,
        totalUsage: codes.reduce((acc, c) => acc + (c.usage_count || 0), 0),
        totalEarnings: codes.reduce((acc, c) => acc + (Number(c.total_earnings || 0)), 0)
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
