
type Country = "SN" | "FR" | "US" | "CA";
type Language = "fr" | "en";

interface DocumentTypes {
  [key: string]: string;
}

interface Translations {
  [key: string]: {
    [key in Language]: string | DocumentTypes;
  };
}

const translations: Translations = {
  appName: {
    fr: "Sama Pièce",
    en: "Sama Pièce"
  },
  welcomeMessage: {
    fr: "Retrouvez facilement vos pièces d'identité perdues grâce à notre communauté solidaire. Signalez, recherchez et récupérez vos documents en toute simplicité.",
    en: "Easily find your lost identity documents thanks to our supportive community. Report, search and recover your documents with ease."
  },
  signalCard: {
    fr: "Signaler une carte trouvée",
    en: "Report a found card"
  },
  searchCard: {
    fr: "Rechercher ma carte",
    en: "Search my card"
  },
  profile: {
    fr: "Profil",
    en: "Profile"
  },
  settings: {
    fr: "Paramètres",
    en: "Settings"
  },
  language: {
    fr: "Langue",
    en: "Language"
  },
  french: {
    fr: "Français",
    en: "French"
  },
  english: {
    fr: "Anglais",
    en: "English"
  },
  demo: {
    fr: "Démo",
    en: "Demo"
  },
  downloadApp: {
    fr: "Télécharger l'app",
    en: "Download app"
  },
  viewDemo: {
    fr: "Voir la démo",
    en: "View demo"
  },
  howItWorks: {
    fr: "Comment ça marche ?",
    en: "How it works?"
  },
  getStarted: {
    fr: "Commencer maintenant",
    en: "Get started now"
  },
  documentTypes: {
    fr: {
      id: "Carte d'identité nationale",
      driver_license: "Permis de conduire", 
      passport: "Passeport",
      vehicle_registration: "Carte grise véhicule",
      motorcycle_registration: "Carte grise moto",
      residence_permit: "Titre de séjour",
      student_card: "Carte étudiante"
    },
    en: {
      id: "National ID Card",
      driver_license: "Driver's License",
      passport: "Passport", 
      vehicle_registration: "Vehicle Registration",
      motorcycle_registration: "Motorcycle Registration",
      residence_permit: "Residence Permit",
      student_card: "Student Card"
    }
  },
  deliveryOption: {
    fr: "Nous proposons un service de livraison à domicile pour vous faire parvenir votre document récupéré.",
    en: "We offer a home delivery service to get your recovered document to you."
  }
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

export const getAvailableLanguages = (): Array<{code: Language, name: string, flag: string}> => [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" }
];
