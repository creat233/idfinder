
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminAd } from '@/types/adminAds';

export const usePublicAds = () => {
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicAds = async () => {
      setLoading(true);
      // On utilise la fonction RPC pour s'assurer que seuls les publicités publiques
      // et actives sont retournées, pour tous les types d'utilisateurs.
      const { data, error } = await supabase.rpc('get_public_ads');

      if (error) {
        console.error('Error fetching public ads:', error);
        setAds([]);
      } else {
        setAds(data || []);
      }
      setLoading(false);
    };

    fetchPublicAds();
  }, []);

  return { ads, loading };
};
