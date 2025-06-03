
export const translations = {
  SN: {
    appName: "FinderID Sénégal",
    welcomeMessage: "Bienvenue sur FinderID Sénégal - Retrouvez vos documents perdus",
    documentTypes: {
      id: "Carte d'identité nationale",
      driver_license: "Permis de conduire",
      passport: "Passeport",
      vehicle_registration: "Carte grise véhicule",
      motorcycle_registration: "Carte grise moto",
      residence_permit: "Carte de séjour",
      student_card: "Carte étudiante"
    },
    deliveryOption: "🚚 Livraison à domicile disponible dans tout le Sénégal"
  },
  CI: {
    appName: "FinderID Côte d'Ivoire",
    welcomeMessage: "Bienvenue sur FinderID Côte d'Ivoire - Retrouvez vos documents perdus",
    documentTypes: {
      id: "Carte nationale d'identité",
      driver_license: "Permis de conduire",
      passport: "Passeport",
      vehicle_registration: "Carte grise véhicule",
      motorcycle_registration: "Carte grise moto",
      residence_permit: "Attestation de résidence",
      student_card: "Carte étudiante"
    },
    deliveryOption: "🚚 Livraison à domicile disponible à Abidjan et environs"
  },
  ML: {
    appName: "FinderID Mali",
    welcomeMessage: "Bienvenue sur FinderID Mali - Retrouvez vos documents perdus",
    documentTypes: {
      id: "Carte d'identité NINA",
      driver_license: "Permis de conduire",
      passport: "Passeport",
      vehicle_registration: "Carte grise véhicule",
      motorcycle_registration: "Carte grise moto",
      residence_permit: "Carte de séjour",
      student_card: "Carte étudiante"
    },
    deliveryOption: "🚚 Livraison à domicile disponible à Bamako"
  },
  BF: {
    appName: "FinderID Burkina Faso",
    welcomeMessage: "Bienvenue sur FinderID Burkina Faso - Retrouvez vos documents perdus",
    documentTypes: {
      id: "Carte nationale d'identité burkinabè",
      driver_license: "Permis de conduire",
      passport: "Passeport",
      vehicle_registration: "Carte grise véhicule",
      motorcycle_registration: "Carte grise moto",
      residence_permit: "Carte de séjour",
      student_card: "Carte étudiante"
    },
    deliveryOption: "🚚 Livraison à domicile disponible à Ouagadougou"
  },
  GN: {
    appName: "FinderID Guinée",
    welcomeMessage: "Bienvenue sur FinderID Guinée - Retrouvez vos documents perdus",
    documentTypes: {
      id: "Carte nationale d'identité",
      driver_license: "Permis de conduire",
      passport: "Passeport",
      vehicle_registration: "Carte grise véhicule",
      motorcycle_registration: "Carte grise moto",
      residence_permit: "Carte de séjour",
      student_card: "Carte étudiante"
    },
    deliveryOption: "🚚 Livraison à domicile disponible à Conakry"
  },
  FR: {
    appName: "FinderID France",
    welcomeMessage: "Bienvenue sur FinderID France - Retrouvez vos documents perdus",
    documentTypes: {
      id: "Carte nationale d'identité",
      driver_license: "Permis de conduire",
      passport: "Passeport",
      vehicle_registration: "Carte grise",
      motorcycle_registration: "Carte grise moto",
      residence_permit: "Carte de séjour",
      student_card: "Carte étudiante"
    },
    deliveryOption: "🚚 Livraison à domicile disponible en France métropolitaine"
  },
  MA: {
    appName: "FinderID Maroc",
    welcomeMessage: "Bienvenue sur FinderID Maroc - Retrouvez vos documents perdus",
    documentTypes: {
      id: "Carte nationale d'identité",
      driver_license: "Permis de conduire",
      passport: "Passeport",
      vehicle_registration: "Carte grise véhicule",
      motorcycle_registration: "Carte grise moto",
      residence_permit: "Carte de séjour",
      student_card: "Carte étudiante"
    },
    deliveryOption: "🚚 Livraison à domicile disponible dans les grandes villes"
  },
  // Ajouter d'autres pays avec des traductions par défaut
  default: {
    appName: "FinderID",
    welcomeMessage: "Bienvenue sur FinderID - Retrouvez vos documents perdus",
    documentTypes: {
      id: "Carte d'identité",
      driver_license: "Permis de conduire",
      passport: "Passeport",
      vehicle_registration: "Carte grise véhicule",
      motorcycle_registration: "Carte grise moto",
      residence_permit: "Carte de séjour",
      student_card: "Carte étudiante"
    },
    deliveryOption: "🚚 Livraison à domicile disponible"
  }
};

export const getTranslation = (countryCode: string, key: string): string => {
  const countryTranslations = translations[countryCode as keyof typeof translations] || translations.default;
  
  // Pour les types de documents
  if (key.startsWith('documentTypes.')) {
    const docType = key.replace('documentTypes.', '');
    return countryTranslations.documentTypes[docType as keyof typeof countryTranslations.documentTypes] || key;
  }
  
  // Pour les autres clés
  return countryTranslations[key as keyof typeof countryTranslations] || key;
};
