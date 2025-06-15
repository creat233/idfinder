
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminAd } from '@/types/adminAds';

export const usePublicAds = () => {
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicAds = async () => {
      setLoading(true);
      // La politique RLS s'occupe de filtrer les publicités
      // pour les utilisateurs non authentifiés.
      const { data, error } = await supabase
        .from('admin_ads')
        .select('*');

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
