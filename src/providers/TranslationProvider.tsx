
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getTranslation, Country, Language, getAvailableLanguages } from "@/utils/translations";
import { supabase } from "@/integrations/supabase/client";

interface TranslationContextType {
  t: (key: string) => string;
  currentCountry: Country;
  currentLanguage: Language;
  setCurrentCountry: (country: string) => void;
  changeLanguage: (language: string) => void;
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const availableLanguages = getAvailableLanguages().map(l => l.code);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [currentCountry, setCurrentCountry] = useState<Country>("SN");
  const [currentLanguage, setCurrentLanguage] = useState<Language>("fr");

  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const savedLanguage = localStorage.getItem("app_language") as Language;
        if (savedLanguage && availableLanguages.includes(savedLanguage)) {
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
            setCurrentCountry(profile.country as Country);
          }
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    };

    loadUserPreferences();
  }, []);
  
  const changeLanguage = (language: string) => {
    const lang = language as Language;
    if (availableLanguages.includes(lang)) {
        setCurrentLanguage(lang);
        localStorage.setItem("app_language", language);
    }
  };

  const t = (key: string): string => {
    return getTranslation(currentCountry, currentLanguage, key);
  };
  
  const value = {
    t,
    currentCountry,
    currentLanguage,
    setCurrentCountry: (country: string) => setCurrentCountry(country as Country),
    changeLanguage,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
