
import { useState, useEffect } from "react";
import { getTranslation } from "@/utils/translations";
import { supabase } from "@/integrations/supabase/client";

export const useTranslation = () => {
  const [currentCountry, setCurrentCountry] = useState<string>("SN");
  const [currentLanguage, setCurrentLanguage] = useState<string>("fr");

  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        // Charger depuis localStorage d'abord
        const savedLanguage = localStorage.getItem("app_language");
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
        }

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
        console.error('Error loading user preferences:', error);
      }
    };

    loadUserPreferences();
  }, []);

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem("app_language", language);
  };

  const t = (key: string): string => {
    return getTranslation(currentCountry as any, currentLanguage as any, key);
  };

  return { 
    t, 
    currentCountry, 
    currentLanguage, 
    setCurrentCountry, 
    changeLanguage 
  };
};
