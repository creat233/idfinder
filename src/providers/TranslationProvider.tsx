
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getTranslation, Country, Language, getAvailableLanguages } from "@/utils/translations";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';

interface TranslationContextType {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  currentCountry: Country;
  currentLanguage: Language;
  setCurrentCountry: (country: string) => void;
  changeLanguage: (language: string) => void;
  user: User | null;
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const availableLanguages = getAvailableLanguages().map(l => l.code);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [currentCountry, setCurrentCountry] = useState<Country>("SN");
  const [currentLanguage, setCurrentLanguage] = useState<Language>("fr");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Language preference
    const savedLanguage = localStorage.getItem("app_language") as Language;
    if (savedLanguage && availableLanguages.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }

    // Auth state and user profile
    const fetchUserAndProfile = async (user: User | null) => {
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('country')
          .eq('id', user.id)
          .single();
        
        if (profile?.country) {
          setCurrentCountry(profile.country as Country);
        }
      } else {
        setCurrentCountry('SN');
      }
    };
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserAndProfile(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        fetchUserAndProfile(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const changeLanguage = (language: string) => {
    const lang = language as Language;
    if (availableLanguages.includes(lang)) {
        setCurrentLanguage(lang);
        localStorage.setItem("app_language", language);
    }
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    let translation = getTranslation(currentCountry, currentLanguage, key);
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
      });
    }
    return translation;
  };
  
  const value = {
    t,
    currentCountry,
    currentLanguage,
    setCurrentCountry: (country: string) => setCurrentCountry(country as Country),
    changeLanguage,
    user,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
