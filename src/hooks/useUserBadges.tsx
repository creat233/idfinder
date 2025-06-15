
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Critère pour le badge "Top Signaleur" : au moins 5 cartes signalées
const TOP_REPORTER_THRESHOLD = 5;

export const useUserBadges = () => {
  const [loading, setLoading] = useState(true);
  const [topReporterEarned, setTopReporterEarned] = useState(false);
  const [premiumMemberEarned, setPremiumMemberEarned] = useState(false);

  const fetchBadgeStatus = async (user: User | null) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Vérifier le badge Top Signaleur
      const { count: reportCount, error: reportError } = await supabase
        .from('reported_cards')
        .select('*', { count: 'exact', head: true })
        .eq('reporter_id', user.id);

      if (reportError) throw reportError;
      setTopReporterEarned(reportCount !== null && reportCount >= TOP_REPORTER_THRESHOLD);

      // Vérifier le badge Membre Premium (basé sur les codes promo payés)
      const { data: promoData, error: promoError } = await supabase
        .from('promo_codes')
        .select('is_paid')
        .eq('user_id', user.id)
        .eq('is_paid', true);
      
      if (promoError) throw promoError;
      setPremiumMemberEarned(promoData && promoData.length > 0);

    } catch (error) {
      console.error('Erreur lors de la récupération du statut des badges:', error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, topReporterEarned, premiumMemberEarned, fetchBadgeStatus };
};
