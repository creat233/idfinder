
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
      // Récupérer les utilisations de codes promo avec les informations des propriétaires
      const { data: usageData, error: usageError } = await supabase
        .from("promo_usage")
        .select(`
          *,
          promo_codes (
            code,
            user_id,
            profiles (
              first_name,
              last_name,
              phone
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (usageError) throw usageError;

      // Récupérer les informations des utilisateurs via l'API admin
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

      if (usersError) {
        console.error("Error fetching users:", usersError);
      }

      // Transformer les données pour les rendre plus utilisables
      const enrichedRecoveries = (usageData || []).map(usage => {
        const promoCode = usage.promo_codes;
        const profile = promoCode?.profiles;
        const user = usersData?.users?.find(u => u.id === promoCode?.user_id);

        return {
          id: usage.id,
          promo_code_id: usage.promo_code_id,
          used_by_email: usage.used_by_email,
          used_by_phone: usage.used_by_phone,
          discount_amount: usage.discount_amount,
          created_at: usage.created_at,
          promo_code: promoCode?.code || 'Code non trouvé',
          promo_owner_email: user?.email || 'Email non trouvé',
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
