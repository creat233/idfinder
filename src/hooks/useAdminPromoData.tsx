
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { PromoCodeData, PromoCodeStats } from "@/types/promo";
import { AdminPromoService } from "@/services/adminPromoService";
import { calculatePromoStats, setupRealtimeSubscription } from "@/utils/adminPromoUtils";

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
      console.log("=== DÉBUT RÉCUPÉRATION CODES PROMO (ADMIN) ===");
      setLoading(true);
      
      const enrichedCodes = await AdminPromoService.getAllPromoCodes();
      
      setPromoCodes(enrichedCodes);
      
      const calculatedStats = calculatePromoStats(enrichedCodes);
      setStats(calculatedStats);

      console.log("📈 STATISTIQUES:", calculatedStats);
      console.log("=== FIN RÉCUPÉRATION CODES PROMO (ADMIN) ===");

    } catch (error: any) {
      console.error("💥 ERREUR GLOBALE (ADMIN):", error);
      showError("Erreur", `Impossible de récupérer les données des codes promo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodesData();
    
    // S'abonner aux changements en temps réel
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
