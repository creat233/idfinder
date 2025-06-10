
import { Country, Language, Translations } from './types';
import { appTranslations } from './app';
import { authTranslations } from './auth';
import { profileTranslations } from './profile';
import { cardsTranslations } from './cards';
import { notificationsTranslations } from './notifications';
import { reportingTranslations } from './reporting';
import { promoTranslations } from './promo';
import { getAvailableLanguages } from './languages';

// Combine all translations
export const translations: Record<string, { fr: string; en: string }> = {
  ...appTranslations,
  ...authTranslations,
  ...profileTranslations,
  ...cardsTranslations,
  ...notificationsTranslations,
  ...reportingTranslations,
  ...promoTranslations
};

export const getTranslation = (country: Country, language: Language, key: string): string => {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation key '${key}' not found`);
    return key;
  }
  
  const value = translation[language] || translation.fr || key;
  return typeof value === 'string' ? value : key;
};

// Re-export types and utilities
export type { Country, Language, Translations } from './types';
export { getAvailableLanguages };
