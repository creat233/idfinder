
import { useState, useEffect } from "react";
import { getTranslation } from "@/utils/translations";
import { supabase } from "@/integrations/supabase/client";

export const useTranslation = () => {
  const [currentCountry, setCurrentCountry] = useState<string>("SN");

  useEffect(() => {
    const loadUserCountry = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('country')
            .eq('id', user.id)
            .single();
          
          if (profile?.country) {
            setCurrentCountry(profile.country);
          }
        }
      } catch (error) {
        console.error('Error loading user country:', error);
      }
    };

    loadUserCountry();
  }, []);

  const t = (key: string): string => {
    return getTranslation(currentCountry, key);
  };

  return { t, currentCountry, setCurrentCountry };
};
