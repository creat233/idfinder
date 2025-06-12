
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
      
      // Récupérer tous les codes promo
      const { data: codesData, error: codesError } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (codesError) {
        console.error("Erreur lors de la récupération des codes:", codesError);
        throw codesError;
      }

      console.log("Codes récupérés:", codesData);

      if (!codesData) {
        setPromoCodes([]);
        setLoading(false);
        return;
      }

      // Récupérer les profils
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, phone");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      }

      console.log("Profils récupérés:", profilesData);

      // Récupérer les utilisateurs via l'API admin pour les emails
      let usersData: any = null;
      try {
        const { data, error: usersError } = await supabase.auth.admin.listUsers();
        if (usersError) {
          console.error("Error fetching users:", usersError);
        } else {
          usersData = data;
        }
      } catch (error) {
        console.error("Admin API not available:", error);
      }

      // Combiner les données
      const enrichedCodes = codesData.map(code => {
        const user = usersData?.users?.find((u: any) => u.id === code.user_id);
        const profile = profilesData?.find((p: Profile) => p.id === code.user_id);
        
        const enrichedCode = {
          ...code,
          user_email: user?.email || 'Email non disponible',
          user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Nom non renseigné' : 'Nom non renseigné'
        };

        console.log("Code enrichi:", enrichedCode);
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
