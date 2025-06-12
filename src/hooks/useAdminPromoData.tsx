
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { PromoCodeData, PromoCodeStats } from "@/types/promo";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
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
      // Récupérer tous les codes promo
      const { data: codesData, error: codesError } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (codesError) throw codesError;

      if (!codesData) {
        setPromoCodes([]);
        setLoading(false);
        return;
      }

      // Récupérer les informations des utilisateurs via l'API admin
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

      if (usersError) {
        console.error("Error fetching users:", usersError);
      }

      // Récupérer les profils
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      }

      // Typer correctement profilesData et filtrer les valeurs null/undefined
      const profiles: Profile[] = profilesData ? profilesData.filter((profile: any): profile is Profile => {
        return profile !== null && 
               profile !== undefined && 
               typeof profile === 'object' && 
               'id' in profile && 
               typeof profile.id === 'string';
      }) : [];

      // Combiner les données
      const enrichedCodes = codesData.map(code => {
        const user = usersData?.users?.find(u => u.id === code.user_id);
        
        // Chercher le profil avec le typage correct
        const profile = profiles.find(p => p.id === code.user_id) || null;
        
        return {
          ...code,
          user_email: user?.email || 'Email non trouvé',
          user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Nom non renseigné' : 'Nom non renseigné'
        };
      });

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
