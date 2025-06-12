
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";

interface RecoveryData {
  id: string;
  promo_code_id: string;
  used_by_email: string | null;
  used_by_phone: string | null;
  discount_amount: number;
  created_at: string;
  promo_code: string;
  promo_owner_email: string;
  promo_owner_name: string;
  promo_owner_phone: string | null;
}

export const useAdminRecoveryData = () => {
  const [recoveries, setRecoveries] = useState<RecoveryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchRecoveryData = async () => {
    try {
      // Récupérer les utilisations de codes promo
      const { data: usageData, error: usageError } = await supabase
        .from("promo_usage")
        .select("*")
        .order("created_at", { ascending: false });

      if (usageError) throw usageError;

      if (!usageData || usageData.length === 0) {
        setRecoveries([]);
        setLoading(false);
        return;
      }

      // Récupérer les codes promo correspondants
      const promoCodeIds = [...new Set(usageData.map(usage => usage.promo_code_id))];
      const { data: promoCodesData, error: promoCodesError } = await supabase
        .from("promo_codes")
        .select("id, code, user_id")
        .in("id", promoCodeIds);

      if (promoCodesError) throw promoCodesError;

      // Récupérer les profils des propriétaires de codes
      const userIds = [...new Set(promoCodesData?.map(code => code.user_id) || [])];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, phone")
        .in("id", userIds);

      if (profilesError) {
        console.error("Erreur lors de la récupération des profils:", profilesError);
      }

      // Récupérer les utilisateurs via l'API admin (pour les emails)
      let usersData: any = null;
      try {
        const { data, error: usersError } = await supabase.auth.admin.listUsers();
        if (!usersError) {
          usersData = data;
        }
      } catch (error) {
        console.log("Admin API not available, continuing without emails");
      }

      // Enrichir les données de récupération
      const enrichedRecoveries: RecoveryData[] = usageData.map(usage => {
        const promoCode = promoCodesData?.find(code => code.id === usage.promo_code_id);
        const profile = profilesData?.find(p => p.id === promoCode?.user_id);
        const user = usersData?.users?.find((u: any) => u.id === promoCode?.user_id);

        return {
          id: usage.id,
          promo_code_id: usage.promo_code_id,
          used_by_email: usage.used_by_email,
          used_by_phone: usage.used_by_phone,
          discount_amount: usage.discount_amount,
          created_at: usage.created_at,
          promo_code: promoCode?.code || 'Code non trouvé',
          promo_owner_email: user?.email || 'Email non disponible',
          promo_owner_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Nom non renseigné' : 'Nom non renseigné',
          promo_owner_phone: profile?.phone || null
        };
      });

      setRecoveries(enrichedRecoveries);
    } catch (error) {
      console.error("Error fetching recovery data:", error);
      showError("Erreur", "Impossible de récupérer les données de récupération");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecoveryData();
  }, []);

  return {
    recoveries,
    loading,
    refetch: fetchRecoveryData,
  };
};
