
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
      
      // Vérifier d'abord les permissions
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("❌ Utilisateur non connecté");
        setLoading(false);
        return;
      }

      console.log("👤 Utilisateur connecté:", user.email);

      // Vérifier les permissions d'administration
      const { data: permissions, error: permError } = await supabase
        .from("admin_permissions")
        .select("*")
        .eq("user_email", user.email)
        .eq("permission_type", "activate_promo_codes")
        .eq("is_active", true);

      if (permError) {
        console.error("❌ Erreur vérification permissions:", permError);
      }

      console.log("🔒 Permissions trouvées:", permissions);

      // Si l'utilisateur n'a pas de permissions, les créer automatiquement pour cet email spécifique
      if (user.email === "mouhamed110000@gmail.com" && (!permissions || permissions.length === 0)) {
        console.log("➕ Création des permissions pour l'administrateur...");
        const { error: insertError } = await supabase
          .from("admin_permissions")
          .insert({
            user_email: user.email,
            permission_type: "activate_promo_codes",
            is_active: true
          });

        if (insertError) {
          console.error("❌ Erreur création permissions:", insertError);
        } else {
          console.log("✅ Permissions créées avec succès");
        }
      }
      
      // Récupérer TOUS les codes promo sans filtrage par utilisateur
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

      // Récupérer les emails des utilisateurs
      const userEmails: { [key: string]: string } = {};
      for (const userId of userIds) {
        try {
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
          if (!userError && userData.user) {
            userEmails[userId] = userData.user.email || 'Email non disponible';
          }
        } catch (error) {
          console.log(`⚠️ Impossible de récupérer l'email pour l'utilisateur ${userId}`);
          userEmails[userId] = 'Email non disponible';
        }
      }

      console.log("📧 Emails récupérés:", userEmails);

      // Enrichir tous les codes avec les données utilisateur
      const enrichedCodes: PromoCodeData[] = codesData.map(code => {
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
          user_email: userEmails[code.user_id] || 'Email non disponible',
          user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Nom non renseigné' : 'Nom non renseigné'
        };

        return enrichedCode;
      });

      console.log("🔍 CODES ENRICHIS - ANALYSE:", {
        total: enrichedCodes.length,
        enAttente: enrichedCodes.filter(c => !c.is_active && !c.is_paid).length,
        actifs: enrichedCodes.filter(c => c.is_active).length,
        payés: enrichedCodes.filter(c => c.is_paid).length,
        détail: enrichedCodes.map(c => `${c.code}: active=${c.is_active}, paid=${c.is_paid}, user=${c.user_email}`)
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
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'promo_codes'
        },
        (payload) => {
          console.log('🔄 Changement détecté dans promo_codes:', payload);
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
