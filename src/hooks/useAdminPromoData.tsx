
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { PromoCodeData, PromoCodeStats } from "@/types/promo";

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
      
      // Récupérer tous les codes promo sans filtre pour déboguer
      const { data: codesData, error: codesError } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (codesError) {
        console.error("Erreur lors de la récupération des codes:", codesError);
        throw codesError;
      }

      console.log("Tous les codes récupérés:", codesData);

      if (!codesData || codesData.length === 0) {
        console.log("Aucun code promo trouvé dans la base de données");
        setPromoCodes([]);
        setStats({
          totalCodes: 0,
          activeCodes: 0,
          totalUsage: 0,
          totalEarnings: 0
        });
        setLoading(false);
        return;
      }

      // Récupérer tous les profils en une seule requête
      const userIds = [...new Set(codesData.map(code => code.user_id).filter(Boolean))];
      console.log("IDs utilisateurs à récupérer:", userIds);
      
      let profilesData: any[] = [];
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, phone")
          .in("id", userIds);

        if (profilesError) {
          console.error("Erreur lors de la récupération des profils:", profilesError);
        } else {
          profilesData = profiles || [];
        }
      }

      console.log("Profils récupérés:", profilesData);

      // Récupérer les utilisateurs via l'API admin pour les emails (optionnel)
      let usersData: any = null;
      try {
        const { data, error: usersError } = await supabase.auth.admin.listUsers();
        if (!usersError && data) {
          usersData = data;
          console.log("Utilisateurs admin récupérés:", usersData.users?.length || 0);
        }
      } catch (error) {
        console.log("Admin API not available, continuing without emails");
      }

      // Enrichir les codes avec les données utilisateur
      const enrichedCodes: PromoCodeData[] = codesData.map(code => {
        const user = usersData?.users?.find((u: any) => u.id === code.user_id);
        const profile = profilesData?.find(p => p.id === code.user_id);
        
        const enrichedCode: PromoCodeData = {
          id: code.id,
          code: code.code,
          is_active: Boolean(code.is_active),
          is_paid: Boolean(code.is_paid),
          created_at: code.created_at,
          expires_at: code.expires_at,
          total_earnings: Number(code.total_earnings) || 0,
          usage_count: Number(code.usage_count) || 0,
          user_id: code.user_id,
          user_email: user?.email || 'Email non disponible',
          user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Nom non renseigné' : 'Nom non renseigné'
        };

        console.log(`Code ${code.code}: is_active=${enrichedCode.is_active}, is_paid=${enrichedCode.is_paid}`);
        return enrichedCode;
      });

      console.log("Tous les codes enrichis:", enrichedCodes);
      
      // Filtrer les codes en attente pour déboguer
      const pendingCodes = enrichedCodes.filter(code => !code.is_active && !code.is_paid);
      console.log("Codes en attente trouvés:", pendingCodes);
      
      setPromoCodes(enrichedCodes);

      // Calculer les statistiques
      const totalCodes = enrichedCodes.length;
      const activeCodes = enrichedCodes.filter(code => code.is_active).length;
      const totalUsage = enrichedCodes.reduce((sum, code) => sum + (code.usage_count || 0), 0);
      const totalEarnings = enrichedCodes.reduce((sum, code) => sum + (code.total_earnings || 0), 0);

      setStats({
        totalCodes,
        activeCodes,
        totalUsage,
        totalEarnings
      });

      console.log("Statistiques calculées:", { totalCodes, activeCodes, totalUsage, totalEarnings });
      console.log(`Codes en attente: ${pendingCodes.length}`);

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
