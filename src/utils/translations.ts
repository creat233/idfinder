
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
  cardNumber: {
    fr: "Numéro de la carte",
    en: "Card number"
  },
  enterCardNumber: {
    fr: "Entrez le numéro de la carte",
    en: "Enter the card number"
  },
  foundDate: {
    fr: "Date de découverte",
    en: "Found date"
  },
  description: {
    fr: "Description",
    en: "Description"
  },
  descriptionPlaceholder: {
    fr: "Ajoutez des détails sur l'endroit où vous avez trouvé la carte",
    en: "Add details about where you found the card"
  },
  freeServiceStudentCards: {
    fr: "Service gratuit pour cartes étudiantes",
    en: "Free service for student cards"
  },
  studentCardInfo: {
    fr: "En signalant une carte étudiante, votre numéro de téléphone sera visible directement pour que l'étudiant puisse vous contacter immédiatement. C'est un service gratuit pour faciliter la récupération des cartes étudiantes.",
    en: "By reporting a student card, your phone number will be directly visible so the student can contact you immediately. This is a free service to facilitate the recovery of student cards."
  },
  sending: {
    fr: "Envoi en cours...",
    en: "Sending..."
  },
  cardReported: {
    fr: "Carte signalée avec succès",
    en: "Card reported successfully"
  },
  studentCardReported: {
    fr: "Carte étudiante signalée avec succès",
    en: "Student card reported successfully"
  },
  studentCardMessage: {
    fr: "Votre numéro sera affiché directement pour que l'étudiant puisse vous contacter",
    en: "Your number will be displayed directly so the student can contact you"
  },
  thankYouMessage: {
    fr: "Merci d'avoir signalé cette carte",
    en: "Thank you for reporting this card"
  },
  error: {
    fr: "Erreur",
    en: "Error"
  },
  submitError: {
    fr: "Une erreur est survenue lors de la soumission du formulaire",
    en: "An error occurred while submitting the form"
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

export const getDocumentTypeTranslation = (country: Country, language: Language, documentType: string): string => {
  const documentTypes = translations.documentTypes;
  if (!documentTypes) {
    return documentType;
  }
  
  const languageTypes = documentTypes[language] as DocumentTypes;
  if (!languageTypes) {
    return documentType;
  }
  
  return languageTypes[documentType] || documentType;
};

export const getAvailableLanguages = (): Array<{code: Language, name: string, flag: string}> => [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" }
];
