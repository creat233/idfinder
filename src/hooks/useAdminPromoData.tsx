
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
      console.log("=== DÉBUT RÉCUPÉRATION CODES PROMO (ADMIN) ===");
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("❌ Utilisateur non connecté");
        setLoading(false);
        return;
      }

      console.log("👤 Utilisateur connecté:", user.email);

      // Tentative avec la fonction RPC corrigée
      let enrichedCodes: PromoCodeData[] = [];
      
      try {
        console.log("🔄 Appel de la fonction RPC admin_get_all_promo_codes...");
        const { data: codesData, error: codesError } = await supabase
          .rpc('admin_get_all_promo_codes');

        if (codesError) {
          console.error("❌ Erreur fonction RPC:", codesError);
          throw codesError;
        }

        console.log("📊 Données brutes reçues de la RPC:", codesData);

        // Transformer les données de la fonction RPC
        enrichedCodes = (codesData || []).map(code => ({
          id: code.id,
          code: code.code,
          is_active: Boolean(code.is_active),
          is_paid: Boolean(code.is_paid),
          created_at: code.created_at,
          expires_at: code.expires_at,
          total_earnings: Number(code.total_earnings) || 0,
          usage_count: Number(code.usage_count) || 0,
          user_id: code.user_id,
          user_email: code.user_email || `user-${code.user_id.slice(0, 8)}@finderid.com`,
          user_name: code.user_name || `Utilisateur ${code.user_id.slice(0, 8)}`
        }));

        console.log("✅ Codes récupérés via RPC:", enrichedCodes.length);

      } catch (rpcError) {
        console.warn("⚠️ Échec RPC, tentative de fallback:", rpcError);
        
        // Fallback amélioré: récupération directe avec jointure manuelle
        try {
          console.log("🔄 Fallback: requête directe sur promo_codes...");
          const { data: codesData, error: codesError } = await supabase
            .from("promo_codes")
            .select("*")
            .order("created_at", { ascending: false });

          if (codesError) {
            console.error("❌ Erreur récupération codes (fallback):", codesError);
            throw codesError;
          }

          console.log("📊 Codes bruts récupérés:", codesData?.length);

          // Récupérer les profils séparément
          const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, first_name, last_name");

          console.log("📊 Profils récupérés:", profilesData?.length);

          // Créer un map des profils
          const profilesMap = new Map();
          if (profilesData) {
            profilesData.forEach(profile => {
              profilesMap.set(profile.id, profile);
            });
          }

          // Enrichir les codes avec les informations utilisateur
          enrichedCodes = (codesData || []).map(code => {
            const profile = profilesMap.get(code.user_id);
            return {
              id: code.id,
              code: code.code,
              is_active: Boolean(code.is_active),
              is_paid: Boolean(code.is_paid),
              created_at: code.created_at,
              expires_at: code.expires_at,
              total_earnings: Number(code.total_earnings) || 0,
              usage_count: Number(code.usage_count) || 0,
              user_id: code.user_id,
              user_email: profile ? `${profile.first_name}@finderid.com` : `user-${code.user_id.slice(0, 8)}@finderid.com`,
              user_name: profile ? `${profile.first_name} ${profile.last_name || ''}`.trim() : `Utilisateur ${code.user_id.slice(0, 8)}`
            };
          });

          console.log("✅ Codes récupérés via fallback:", enrichedCodes.length);
        } catch (fallbackError) {
          console.error("💥 Échec total du fallback:", fallbackError);
          throw fallbackError;
        }
      }

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

      console.log("📈 STATISTIQUES:", { totalCodes, activeCodes, totalUsage, totalEarnings });
      console.log("=== FIN RÉCUPÉRATION CODES PROMO (ADMIN) ===");

    } catch (error) {
      console.error("💥 ERREUR GLOBALE (ADMIN):", error);
      showError("Erreur", "Impossible de récupérer les données des codes promo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodesData();
    
    // S'abonner aux changements en temps réel
    const channel = supabase
      .channel('admin-promo-codes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'promo_codes'
        },
        (payload) => {
          console.log('🔄 Changement détecté dans promo_codes:', payload);
          fetchPromoCodesData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    promoCodes,
    loading,
    stats,
    refetch: fetchPromoCodesData
  };
};
