import React, { createContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { getTranslation, Country, Language, getAvailableLanguages, translations as dict } from "@/utils/translations";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { DomAutoTranslator } from './DomAutoTranslator';

interface TranslationContextType {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  tt: (text: string) => string;
  currentCountry: Country;
  currentLanguage: Language;
  setCurrentCountry: (country: string) => void;
  changeLanguage: (language: string) => void;
  user: User | null;
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const availableLanguages = getAvailableLanguages().map(l => l.code);
const CACHE_KEY = 'auto_translations_v1';

type AutoCache = Partial<Record<Language, Record<string, string>>>;

const loadCache = (): AutoCache => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
};

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [currentCountry, setCurrentCountry] = useState<Country>("SN");
  const [currentLanguage, setCurrentLanguage] = useState<Language>("fr");
  const [user, setUser] = useState<User | null>(null);
  const [autoCache, setAutoCache] = useState<AutoCache>(() => loadCache());

  // Pending items to translate, per-language queue
  const pendingRef = useRef<Set<string>>(new Set());
  const inFlightRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("app_language") as Language;
    if (savedLanguage && availableLanguages.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }

    const fetchUserAndProfile = async (u: User | null) => {
      setUser(u);
      if (u) {
        const { data: profile } = await supabase
          .from('profiles').select('country').eq('id', u.id).single();
        if (profile?.country) setCurrentCountry(profile.country as Country);
      } else {
        setCurrentCountry('SN');
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserAndProfile(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      fetchUserAndProfile(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const flushQueue = useCallback(async (lang: Language) => {
    if (lang === 'fr') { pendingRef.current.clear(); return; }
    const texts = Array.from(pendingRef.current).filter(t => !inFlightRef.current.has(t));
    if (texts.length === 0) return;
    texts.forEach(t => inFlightRef.current.add(t));
    pendingRef.current.clear();

    // chunk to keep prompts small
    const chunks: string[][] = [];
    for (let i = 0; i < texts.length; i += 40) chunks.push(texts.slice(i, i + 40));

    try {
      const results = await Promise.all(chunks.map(async (chunk) => {
        const { data, error } = await supabase.functions.invoke('translate-ui', {
          body: { texts: chunk, targetLang: lang },
        });
        if (error) throw error;
        return { chunk, translations: (data?.translations ?? chunk) as string[] };
      }));

      setAutoCache(prev => {
        const next: AutoCache = { ...prev, [lang]: { ...(prev[lang] || {}) } };
        for (const { chunk, translations } of results) {
          chunk.forEach((src, i) => {
            next[lang]![src] = translations[i] ?? src;
          });
        }
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
    } catch (e) {
      console.warn('[i18n] auto-translate failed', e);
    } finally {
      texts.forEach(t => inFlightRef.current.delete(t));
    }
  }, []);

  const queueTranslate = useCallback((text: string, lang: Language) => {
    if (!text || lang === 'fr') return;
    const cached = autoCache[lang]?.[text];
    if (cached !== undefined) return;
    if (inFlightRef.current.has(text)) return;
    pendingRef.current.add(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => flushQueue(lang), 250);
  }, [autoCache, flushQueue]);

  const changeLanguage = (language: string) => {
    const lang = language as Language;
    if (availableLanguages.includes(lang)) {
      setCurrentLanguage(lang);
      localStorage.setItem("app_language", language);
    }
  };

  const applyReplacements = (s: string, replacements?: Record<string, string | number>) => {
    if (!replacements) return s;
    let out = s;
    Object.keys(replacements).forEach(p => {
      out = out.split(`{${p}}`).join(String(replacements[p]));
    });
    return out;
  };

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    const entry = dict[key];
    if (!entry) {
      // Unknown key: try auto-translating the key itself if it looks like a sentence
      return applyReplacements(key, replacements);
    }
    const direct = (entry as any)[currentLanguage];
    if (direct && currentLanguage !== 'fr') return applyReplacements(direct, replacements);
    if (currentLanguage === 'fr') return applyReplacements(entry.fr, replacements);
    // No direct translation for this language -> auto-translate the French source
    const src = entry.fr;
    const cached = autoCache[currentLanguage]?.[src];
    if (cached) return applyReplacements(cached, replacements);
    queueTranslate(src, currentLanguage);
    return applyReplacements(src, replacements);
  }, [currentLanguage, autoCache, queueTranslate]);

  const tt = useCallback((text: string): string => {
    if (!text || currentLanguage === 'fr') return text;
    const cached = autoCache[currentLanguage]?.[text];
    if (cached) return cached;
    queueTranslate(text, currentLanguage);
    return text;
  }, [currentLanguage, autoCache, queueTranslate]);

  const value = {
    t,
    tt,
    currentCountry,
    currentLanguage,
    setCurrentCountry: (country: string) => setCurrentCountry(country as Country),
    changeLanguage,
    user,
  };

  return (
    <TranslationContext.Provider value={value}>
      <DomAutoTranslator />
      {children}
    </TranslationContext.Provider>
  );
};
