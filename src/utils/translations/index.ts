
import { Country, Language, Translations } from './types';
import { appTranslations } from './app';
import { authTranslations } from './auth';
import { profileTranslations } from './profile';
import { cardsTranslations } from './cards';
import { notificationsTranslations } from './notifications';
import { reportingTranslations } from './reporting';
import { promoTranslations } from './promo';
import { featuresTranslations } from './features';
import { demoTranslations } from './demo';
import { getAvailableLanguages } from './languages';
import { emergencyTranslations } from './emergency';
import { accountTranslations } from './account';
import { statsTranslations } from './stats';
import { mcardsTranslations } from './mcards';

// Combine all translations
export const translations: Record<string, { fr: string; en: string }> = {
  ...appTranslations,
  ...authTranslations,
  ...profileTranslations,
  ...cardsTranslations,
  ...notificationsTranslations,
  ...reportingTranslations,
  ...promoTranslations,
  ...featuresTranslations,
  ...demoTranslations,
  ...emergencyTranslations,
  ...accountTranslations,
  ...statsTranslations,
  ...mcardsTranslations
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
