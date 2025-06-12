
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
      console.log("=== DÉBUT RÉCUPÉRATION CODES PROMO ===");
      setLoading(true);
      
      // Récupérer TOUS les codes promo
      const { data: codesData, error: codesError } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (codesError) {
        console.error("❌ Erreur récupération codes:", codesError);
        throw codesError;
      }

      console.log("📊 CODES RÉCUPÉRÉS:", {
        total: codesData?.length || 0,
        codes: codesData?.map(c => ({
          code: c.code,
          active: c.is_active,
          paid: c.is_paid,
          user_id: c.user_id,
          created: c.created_at
        })) || []
      });

      if (!codesData || codesData.length === 0) {
        console.log("⚠️ Aucun code promo trouvé dans la base");
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

      // Récupérer les profils des utilisateurs
      const userIds = [...new Set(codesData.map(code => code.user_id).filter(Boolean))];
      console.log("👥 IDs utilisateurs à récupérer:", userIds);
      
      let profilesData: any[] = [];
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, phone")
          .in("id", userIds);

        if (profilesError) {
          console.error("❌ Erreur profils:", profilesError);
        } else {
          profilesData = profiles || [];
          console.log("✅ Profils récupérés:", profilesData.length);
        }
      }

      // Récupérer les emails via l'API admin
      let usersData: any = null;
      try {
        const { data, error: usersError } = await supabase.auth.admin.listUsers();
        if (!usersError && data) {
          usersData = data;
          console.log("✅ Admin users récupérés:", usersData.users?.length || 0);
        }
      } catch (error) {
        console.log("⚠️ Admin API non disponible");
      }

      // Enrichir tous les codes avec les données utilisateur
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

        return enrichedCode;
      });

      console.log("🔍 CODES ENRICHIS - ANALYSE:", {
        total: enrichedCodes.length,
        enAttente: enrichedCodes.filter(c => !c.is_active && !c.is_paid).length,
        actifs: enrichedCodes.filter(c => c.is_active).length,
        payés: enrichedCodes.filter(c => c.is_paid).length,
        détail: enrichedCodes.map(c => `${c.code}: active=${c.is_active}, paid=${c.is_paid}`)
      });
      
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
      console.log("=== FIN RÉCUPÉRATION CODES PROMO ===");

    } catch (error) {
      console.error("💥 ERREUR GLOBALE:", error);
      showError("Erreur", "Impossible de récupérer les données des codes promo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodesData();
    
    // S'abonner aux changements en temps réel pour les nouveaux codes
    const channel = supabase
      .channel('promo-codes-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'promo_codes'
        },
        (payload) => {
          console.log('🆕 Nouveau code promo détecté:', payload);
          fetchPromoCodesData(); // Actualiser la liste
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
