
type Country = "SN" | "FR" | "US" | "CA";
type Language = "fr" | "en";

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations = {
  fr: {
    // Application
    appName: "FinderID",
    home: "Accueil",
    signalCard: "Signaler une carte",
    support: "Support",
    profile: "Profil",
    back: "Retour",
    login: "Connexion",
    logout: "Déconnexion",
    loggingOut: "Déconnexion...",
    loading: "Chargement...",
    
    // Authentication
    createAccount: "Créer un compte",
    joinFinderID: "Rejoignez FinderID",
    accessAccount: "Accédez à votre compte",
    firstName: "Prénom",
    lastName: "Nom",
    phone: "Téléphone",
    email: "E-mail",
    password: "Mot de passe",
    register: "S'inscrire",
    alreadyHaveAccount: "Vous avez déjà un compte ? Connectez-vous",
    noAccount: "Pas de compte ? Créez-en un",
    registrationSuccess: "Inscription réussie",
    checkEmailConfirm: "Vérifiez votre email pour confirmer votre compte",
    loginSuccess: "Connexion réussie",
    error: "Erreur",

    // Profile
    myProfile: "Mon Profil",
    supportAndFaq: "Support et FAQ",
    helpWithQuestions: "Nous sommes là pour vous aider avec toutes vos questions",

    // Card Management
    myCards: "Mes cartes",
    addCard: "Ajouter une carte",
    cardNumber: "Numéro de la carte",
    enterCardNumber: "Entrez le numéro de la carte",
    documentType: "Type de document",
    idCard: "Carte d'identité",
    passport: "Passeport",
    driverLicense: "Permis de conduire",
    studentCard: "Carte d'étudiant",
    cardHolderName: "Nom du titulaire",
    enterCardHolderName: "Entrez le nom du titulaire",
    optional: "Optionnel",
    cancel: "Annuler",
    add: "Ajouter",
    adding: "Ajout...",
    active: "Actif",
    inactive: "Inactif",
    receiveNotifications: "Recevoir des notifications",
    noCardsAdded: "Aucune carte ajoutée pour le moment",
    addCardsToReceiveNotifications: "Ajoutez vos cartes pour recevoir des notifications si elles sont signalées",
    howItWorks: "Comment ça marche ?",
    cardsExplanation: "Ajoutez les numéros de vos cartes d'identité pour recevoir automatiquement une notification si quelqu'un les signale comme trouvées sur FinderID. Vous pourrez ainsi les récupérer rapidement.",

    // Notifications
    notifications: "Notifications",
    noNotifications: "Aucune notification",
    notificationsWillAppearHere: "Vos notifications apparaîtront ici",
    markAllAsRead: "Tout marquer comme lu",

    // Card Reporting
    foundDate: "Date de découverte",
    description: "Description",
    descriptionPlaceholder: "Ajoutez des détails sur l'endroit où vous avez trouvé la carte",
    studentCardReported: "Carte étudiante signalée avec succès",
    studentCardMessage: "Votre numéro sera affiché directement pour que l'étudiant puisse vous contacter",
    cardReported: "Carte signalée avec succès",
    thankYouMessage: "Merci d'avoir signalé cette carte",
    submitError: "Une erreur est survenue lors de la soumission du formulaire",
    sending: "Envoi en cours...",
    freeServiceStudentCards: "Service gratuit pour cartes étudiantes",
    studentCardInfo: "En signalant une carte étudiante, votre numéro de téléphone sera visible directement pour que l'étudiant puisse vous contacter immédiatement. C'est un service gratuit pour faciliter la récupération des cartes étudiantes."
  },
  en: {
    // Application
    appName: "FinderID",
    home: "Home",
    signalCard: "Report Card",
    support: "Support",
    profile: "Profile",
    back: "Back",
    login: "Login",
    logout: "Logout",
    loggingOut: "Logging out...",
    loading: "Loading...",
    
    // Authentication
    createAccount: "Create Account",
    joinFinderID: "Join FinderID",
    accessAccount: "Access your account",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone",
    email: "Email",
    password: "Password",
    register: "Register",
    alreadyHaveAccount: "Already have an account? Sign in",
    noAccount: "No account? Create one",
    registrationSuccess: "Registration successful",
    checkEmailConfirm: "Check your email to confirm your account",
    loginSuccess: "Login successful",
    error: "Error",

    // Profile
    myProfile: "My Profile",
    supportAndFaq: "Support & FAQ",
    helpWithQuestions: "We're here to help with all your questions",

    // Card Management
    myCards: "My Cards",
    addCard: "Add Card",
    cardNumber: "Card Number",
    enterCardNumber: "Enter card number",
    documentType: "Document Type",
    idCard: "ID Card",
    passport: "Passport",
    driverLicense: "Driver's License",
    studentCard: "Student Card",
    cardHolderName: "Cardholder Name",
    enterCardHolderName: "Enter cardholder name",
    optional: "Optional",
    cancel: "Cancel",
    add: "Add",
    adding: "Adding...",
    active: "Active",
    inactive: "Inactive",
    receiveNotifications: "Receive notifications",
    noCardsAdded: "No cards added yet",
    addCardsToReceiveNotifications: "Add your cards to receive notifications if they are reported",
    howItWorks: "How it works?",
    cardsExplanation: "Add your ID card numbers to automatically receive a notification if someone reports them as found on FinderID. You can then quickly recover them.",

    // Notifications
    notifications: "Notifications",
    noNotifications: "No notifications",
    notificationsWillAppearHere: "Your notifications will appear here",
    markAllAsRead: "Mark all as read",

    // Card Reporting
    foundDate: "Found Date",
    description: "Description",
    descriptionPlaceholder: "Add details about where you found the card",
    studentCardReported: "Student card reported successfully",
    studentCardMessage: "Your number will be displayed directly so the student can contact you",
    cardReported: "Card reported successfully",
    thankYouMessage: "Thank you for reporting this card",
    submitError: "An error occurred while submitting the form",
    sending: "Sending...",
    freeServiceStudentCards: "Free service for student cards",
    studentCardInfo: "By reporting a student card, your phone number will be visible directly so the student can contact you immediately. This is a free service to facilitate student card recovery."
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
