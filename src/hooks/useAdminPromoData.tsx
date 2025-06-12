
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { PromoCodeData, PromoCodeStats } from "@/types/promo";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

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
      console.log("Récupération des codes promo...");
      
      // Récupérer tous les codes promo avec les données utilisateur via une requête jointe optimisée
      const { data: codesWithProfiles, error: codesError } = await supabase
        .from("promo_codes")
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            phone
          )
        `)
        .order("created_at", { ascending: false });

      if (codesError) {
        console.error("Erreur lors de la récupération des codes:", codesError);
        throw codesError;
      }

      console.log("Codes récupérés:", codesWithProfiles);

      if (!codesWithProfiles) {
        setPromoCodes([]);
        setLoading(false);
        return;
      }

      // Récupérer les utilisateurs via l'API admin pour les emails (optionnel)
      let usersData: any = null;
      try {
        const { data, error: usersError } = await supabase.auth.admin.listUsers();
        if (!usersError) {
          usersData = data;
        }
      } catch (error) {
        console.log("Admin API not available, continuing without emails");
      }

      // Enrichir les codes avec les données utilisateur
      const enrichedCodes: PromoCodeData[] = codesWithProfiles.map(code => {
        const user = usersData?.users?.find((u: any) => u.id === code.user_id);
        const profile = code.profiles as any;
        
        const enrichedCode: PromoCodeData = {
          id: code.id,
          code: code.code,
          is_active: code.is_active,
          is_paid: code.is_paid,
          created_at: code.created_at,
          expires_at: code.expires_at,
          total_earnings: code.total_earnings,
          usage_count: code.usage_count,
          user_id: code.user_id,
          user_email: user?.email || 'Email non disponible',
          user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Nom non renseigné' : 'Nom non renseigné'
        };

        return enrichedCode;
      });

      console.log("Tous les codes enrichis:", enrichedCodes);
      setPromoCodes(enrichedCodes);

      // Calculer les statistiques
      const totalCodes = enrichedCodes.length;
      const activeCodes = enrichedCodes.filter(code => code.is_active).length;
      const totalUsage = enrichedCodes.reduce((sum, code) => sum + code.usage_count, 0);
      const totalEarnings = enrichedCodes.reduce((sum, code) => sum + code.total_earnings, 0);

      setStats({
        totalCodes,
        activeCodes,
        totalUsage,
        totalEarnings
      });

      console.log("Statistiques calculées:", { totalCodes, activeCodes, totalUsage, totalEarnings });

    } catch (error) {
      console.error("Error fetching promo codes data:", error);
      showError("Erreur", "Impossible de récupérer les données des codes promo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodesData();
  }, []);

  return {
    promoCodes,
    loading,
    stats,
    refetch: fetchPromoCodesData
  };
};
