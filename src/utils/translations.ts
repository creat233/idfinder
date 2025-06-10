
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
  deliveryOption: {
    fr: "Nous proposons un service de livraison à domicile pour vous faire parvenir votre document récupéré.",
    en: "We offer a home delivery service to get your recovered document to you."
  },
  // Navigation
  home: {
    fr: "Accueil",
    en: "Home"
  },
  support: {
    fr: "Support",
    en: "Support"
  },
  back: {
    fr: "Retour",
    en: "Back"
  },
  logout: {
    fr: "Se déconnecter",
    en: "Logout"
  },
  loggingOut: {
    fr: "Déconnexion...",
    en: "Logging out..."
  },
  // Auth
  login: {
    fr: "Se connecter",
    en: "Login"
  },
  register: {
    fr: "S'inscrire",
    en: "Register"
  },
  createAccount: {
    fr: "Créer un compte",
    en: "Create account"
  },
  joinFinderID: {
    fr: "Rejoignez FinderID",
    en: "Join FinderID"
  },
  accessAccount: {
    fr: "Accédez à votre compte FinderID",
    en: "Access your FinderID account"
  },
  firstName: {
    fr: "Prénom",
    en: "First name"
  },
  lastName: {
    fr: "Nom",
    en: "Last name"
  },
  phone: {
    fr: "Téléphone",
    en: "Phone"
  },
  email: {
    fr: "Email",
    en: "Email"
  },
  password: {
    fr: "Mot de passe",
    en: "Password"
  },
  loading: {
    fr: "Chargement...",
    en: "Loading..."
  },
  alreadyHaveAccount: {
    fr: "Déjà un compte ? Se connecter",
    en: "Already have an account? Login"
  },
  noAccount: {
    fr: "Pas de compte ? S'inscrire",
    en: "No account? Register"
  },
  registrationSuccess: {
    fr: "Inscription réussie",
    en: "Registration successful"
  },
  checkEmailConfirm: {
    fr: "Vérifiez votre email pour confirmer votre compte",
    en: "Check your email to confirm your account"
  },
  loginSuccess: {
    fr: "Connexion réussie",
    en: "Login successful"
  },
  // Profile
  myProfile: {
    fr: "Mon Profil",
    en: "My Profile"
  },
  editProfile: {
    fr: "Modifier le profil",
    en: "Edit profile"
  },
  save: {
    fr: "Sauvegarder",
    en: "Save"
  },
  cancel: {
    fr: "Annuler",
    en: "Cancel"
  },
  profileUpdated: {
    fr: "Profil mis à jour avec succès",
    en: "Profile updated successfully"
  },
  // Support
  needHelp: {
    fr: "Besoin d'aide ?",
    en: "Need help?"
  },
  supportTeam: {
    fr: "Notre équipe d'assistance est disponible pour répondre à toutes vos questions",
    en: "Our support team is available to answer all your questions"
  },
  contactByEmail: {
    fr: "Contacter par email",
    en: "Contact by email"
  },
  call: {
    fr: "Appeler",
    en: "Call"
  },
  emergencyNumbers: {
    fr: "Numéros d'Urgence",
    en: "Emergency Numbers"
  },
  accessEmergencyNumbers: {
    fr: "Accédez rapidement aux numéros d'urgence disponibles au Sénégal",
    en: "Quickly access emergency numbers available in Senegal"
  },
  seeEmergencyNumbers: {
    fr: "Voir les numéros d'urgence",
    en: "See emergency numbers"
  },
  supportAndFaq: {
    fr: "Assistance et FAQ",
    en: "Support and FAQ"
  },
  helpWithQuestions: {
    fr: "Besoin d'aide ? Nous sommes là pour vous assister avec toutes vos questions concernant FinderID.",
    en: "Need help? We are here to assist you with all your questions about FinderID."
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
