import { useState, useEffect } from 'react';
import { MCard } from '@/types/mcard';

interface TranslatedContent {
  full_name: string;
  job_title?: string;
  company?: string;
  description?: string;
  phone_number?: string;
  email?: string;
}

interface Translation {
  fr: TranslatedContent;
  en: TranslatedContent;
}

export const useMCardTranslation = (mcard: MCard | null) => {
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en'>('fr');
  const [translations, setTranslations] = useState<Translation | null>(null);

  // Traductions automatiques basiques (en production, utiliser un service de traduction)
  const translateContent = (content: string, targetLang: 'fr' | 'en'): string => {
    if (!content) return content;
    
    const translations: Record<string, Record<string, string>> = {
      // Titres de poste
      'Développeur': { en: 'Developer' },
      'Designer': { en: 'Designer' },
      'Manager': { en: 'Manager' },
      'Consultant': { en: 'Consultant' },
      'Ingénieur': { en: 'Engineer' },
      'Architecte': { en: 'Architect' },
      'Analyste': { en: 'Analyst' },
      'Chef de projet': { en: 'Project Manager' },
      'Directeur': { en: 'Director' },
      'Entrepreneur': { en: 'Entrepreneur' },
      
      // Entreprises
      'Entreprise': { en: 'Company' },
      'Société': { en: 'Corporation' },
      'Agence': { en: 'Agency' },
      'Studio': { en: 'Studio' },
      'Boutique': { en: 'Shop' },
      'Restaurant': { en: 'Restaurant' },
      'Salon': { en: 'Salon' },
      'Magasin': { en: 'Store' },
      
      // Descriptions communes
      'Spécialisé en': { en: 'Specialized in' },
      'Expert en': { en: 'Expert in' },
      'Passionné par': { en: 'Passionate about' },
      'Plus de': { en: 'More than' },
      'années d\'expérience': { en: 'years of experience' },
      'Services': { en: 'Services' },
      'Produits': { en: 'Products' },
      'Contact': { en: 'Contact' },
      'À propos': { en: 'About' },
      
      // Traductions inverses (en vers fr)
      'Developer': { fr: 'Développeur' },
      'Designer': { fr: 'Designer' },
      'Manager': { fr: 'Manager' },
      'Consultant': { fr: 'Consultant' },
      'Engineer': { fr: 'Ingénieur' },
      'Architect': { fr: 'Architecte' },
      'Analyst': { fr: 'Analyste' },
      'Project Manager': { fr: 'Chef de projet' },
      'Director': { fr: 'Directeur' },
      'Entrepreneur': { fr: 'Entrepreneur' },
      'Company': { fr: 'Entreprise' },
      'Corporation': { fr: 'Société' },
      'Agency': { fr: 'Agence' },
      'Studio': { fr: 'Studio' },
      'Shop': { fr: 'Boutique' },
      'Restaurant': { fr: 'Restaurant' },
      'Salon': { fr: 'Salon' },
      'Store': { fr: 'Magasin' },
      'Specialized in': { fr: 'Spécialisé en' },
      'Expert in': { fr: 'Expert en' },
      'Passionate about': { fr: 'Passionné par' },
      'More than': { fr: 'Plus de' },
      'years of experience': { fr: 'années d\'expérience' },
      'Services': { fr: 'Services' },
      'Products': { fr: 'Produits' },
      'Contact': { fr: 'Contact' },
      'About': { fr: 'À propos' },
    };

    let translatedContent = content;
    
    // Appliquer les traductions
    Object.entries(translations).forEach(([original, translationMap]) => {
      if (translationMap[targetLang]) {
        const regex = new RegExp(original, 'gi');
        translatedContent = translatedContent.replace(regex, translationMap[targetLang]);
      }
    });

    return translatedContent;
  };

  useEffect(() => {
    if (!mcard) return;

    const originalContent: TranslatedContent = {
      full_name: mcard.full_name,
      job_title: mcard.job_title || '',
      company: mcard.company || '',
      description: mcard.description || '',
      phone_number: mcard.phone_number || '',
      email: mcard.email || '',
    };

    // Générer les traductions
    const newTranslations: Translation = {
      fr: originalContent,
      en: {
        full_name: originalContent.full_name, // Les noms ne se traduisent pas
        job_title: translateContent(originalContent.job_title || '', 'en'),
        company: translateContent(originalContent.company || '', 'en'),
        description: translateContent(originalContent.description || '', 'en'),
        phone_number: originalContent.phone_number,
        email: originalContent.email,
      }
    };

    setTranslations(newTranslations);
  }, [mcard]);

  const getTranslatedContent = (): TranslatedContent | null => {
    if (!translations) return null;
    return translations[currentLanguage];
  };

  return {
    currentLanguage,
    setCurrentLanguage,
    translatedContent: getTranslatedContent(),
    isTranslated: currentLanguage !== 'fr'
  };
};