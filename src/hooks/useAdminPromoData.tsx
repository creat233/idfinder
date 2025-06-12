
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
      
      // Vérifier d'abord l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("❌ Utilisateur non connecté");
        setLoading(false);
        return;
      }

      console.log("👤 Utilisateur connecté:", user.email);

      // Pour l'admin spécifique, créer automatiquement les permissions si elles n'existent pas
      if (user.email === "mouhamed110000@gmail.com") {
        console.log("🔑 Vérification/création des permissions admin...");
        
        // Essayer de créer les permissions (ignore les erreurs de duplicata)
        try {
          await supabase
            .from("admin_permissions")
            .upsert({
              user_email: user.email,
              permission_type: "activate_promo_codes",
              is_active: true
            }, {
              onConflict: 'user_email,permission_type'
            });
        } catch (permError) {
          console.log("ℹ️ Permissions déjà existantes ou créées:", permError);
        }
      }
      
      // Utiliser une requête simplifiée sans jointure complexe
      console.log("📊 Récupération des codes promo...");
      const { data: codesData, error: codesError } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (codesError) {
        console.error("❌ Erreur récupération codes:", codesError);
        throw codesError;
      }

      console.log("📊 CODES RÉCUPÉRÉS (RAW):", {
        total: codesData?.length || 0,
        codes: codesData?.map(c => ({
          id: c.id,
          code: c.code,
          active: c.is_active,
          paid: c.is_paid,
          user_id: c.user_id,
          created: c.created_at
        })) || []
      });

      if (!codesData || codesData.length === 0) {
        console.log("⚠️ Aucun code promo trouvé dans la table promo_codes");
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

      // Récupérer les profils pour enrichir les données (optionnel)
      const userIds = [...new Set(codesData.map(code => code.user_id).filter(Boolean))];
      console.log("👥 IDs utilisateurs à traiter:", userIds);
      
      let profilesMap = new Map();
      
      if (userIds.length > 0) {
        try {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, phone')
            .in('id', userIds);

          console.log("👤 Profils récupérés:", profilesData?.length || 0);

          // Créer un map des profils par user_id
          profilesData?.forEach(profile => {
            profilesMap.set(profile.id, profile);
          });
        } catch (profileError) {
          console.log("⚠️ Erreur récupération profils (non bloquant):", profileError);
        }
      }

      // Enrichir tous les codes avec les données disponibles
      const enrichedCodes: PromoCodeData[] = codesData.map(code => {
        const profile = profilesMap.get(code.user_id);
        
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
          user_email: profile ? `${profile.first_name?.toLowerCase() || 'user'}@finderid.com` : `user-${code.user_id.slice(0, 8)}@finderid.com`,
          user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Utilisateur' : `Utilisateur ${code.user_id.slice(0, 8)}`
        };

        return enrichedCode;
      });

      console.log("🔍 CODES ENRICHIS (FINAL) - ANALYSE:", {
        total: enrichedCodes.length,
        enAttente: enrichedCodes.filter(c => !c.is_active && !c.is_paid).length,
        actifs: enrichedCodes.filter(c => c.is_active).length,
        payés: enrichedCodes.filter(c => c.is_paid).length,
        détailCodes: enrichedCodes.map(c => ({
          code: c.code,
          active: c.is_active,
          paid: c.is_paid,
          user: c.user_name,
          created: c.created_at
        }))
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

      console.log("📈 STATISTIQUES FINALES:", { totalCodes, activeCodes, totalUsage, totalEarnings });
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
    
    // S'abonner aux changements en temps réel pour les nouveaux codes
    const channel = supabase
      .channel('admin-promo-codes-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'promo_codes'
        },
        (payload) => {
          console.log('🔄 Changement détecté dans promo_codes (admin):', payload);
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
