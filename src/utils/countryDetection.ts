
// Mapping des indicatifs téléphoniques vers les codes pays
const phoneCountryMap: Record<string, string> = {
  '+221': 'SN', // Sénégal
  '+33': 'FR',  // France
  '+1': 'US',   // États-Unis/Canada
  '+44': 'GB',  // Royaume-Uni
  '+49': 'DE',  // Allemagne
  '+34': 'ES',  // Espagne
  '+39': 'IT',  // Italie
  '+212': 'MA', // Maroc
  '+213': 'DZ', // Algérie
  '+216': 'TN', // Tunisie
  '+225': 'CI', // Côte d'Ivoire
  '+226': 'BF', // Burkina Faso
  '+227': 'NE', // Niger
  '+228': 'TG', // Togo
  '+229': 'BJ', // Bénin
  '+230': 'MU', // Maurice
  '+231': 'LR', // Libéria
  '+232': 'SL', // Sierra Leone
  '+233': 'GH', // Ghana
  '+234': 'NG', // Nigéria
  '+235': 'TD', // Tchad
  '+236': 'CF', // République Centrafricaine
  '+237': 'CM', // Cameroun
  '+238': 'CV', // Cap-Vert
  '+239': 'ST', // Sao Tomé-et-Principe
  '+240': 'GQ', // Guinée Équatoriale
  '+241': 'GA', // Gabon
  '+242': 'CG', // Congo
  '+243': 'CD', // République Démocratique du Congo
  '+244': 'AO', // Angola
  '+245': 'GW', // Guinée-Bissau
  '+246': 'IO', // Territoire britannique de l'océan Indien
  '+248': 'SC', // Seychelles
  '+249': 'SD', // Soudan
  '+250': 'RW', // Rwanda
  '+251': 'ET', // Éthiopie
  '+252': 'SO', // Somalie
  '+253': 'DJ', // Djibouti
  '+254': 'KE', // Kenya
  '+255': 'TZ', // Tanzanie
  '+256': 'UG', // Ouganda
  '+257': 'BI', // Burundi
  '+258': 'MZ', // Mozambique
  '+260': 'ZM', // Zambie
  '+261': 'MG', // Madagascar
  '+262': 'RE', // Réunion
  '+263': 'ZW', // Zimbabwe
  '+264': 'NA', // Namibie
  '+265': 'MW', // Malawi
  '+266': 'LS', // Lesotho
  '+267': 'BW', // Botswana
  '+268': 'SZ', // Eswatini
  '+269': 'KM', // Comores
  '+290': 'SH', // Sainte-Hélène
  '+291': 'ER', // Érythrée
  '+297': 'AW', // Aruba
  '+298': 'FO', // Îles Féroé
  '+299': 'GL'  // Groenland
};

// Informations détaillées des pays
const countryInfo: Record<string, {
  name: { fr: string; en: string };
  flag: string;
  currency: { fr: string; en: string };
  timezone: string;
  emergencyNumbers: {
    police: string;
    fire: string;
    medical: string;
  };
}> = {
  'SN': {
    name: { fr: 'Sénégal', en: 'Senegal' },
    flag: '🇸🇳',
    currency: { fr: 'Franc CFA (XOF)', en: 'CFA Franc (XOF)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '17',
      fire: '18',
      medical: '15'
    }
  },
  'FR': {
    name: { fr: 'France', en: 'France' },
    flag: '🇫🇷',
    currency: { fr: 'Euro (EUR)', en: 'Euro (EUR)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '17',
      fire: '18',
      medical: '15'
    }
  },
  'US': {
    name: { fr: 'États-Unis', en: 'United States' },
    flag: '🇺🇸',
    currency: { fr: 'Dollar américain (USD)', en: 'US Dollar (USD)' },
    timezone: 'GMT-5 to GMT-10',
    emergencyNumbers: {
      police: '911',
      fire: '911',
      medical: '911'
    }
  },
  'MA': {
    name: { fr: 'Maroc', en: 'Morocco' },
    flag: '🇲🇦',
    currency: { fr: 'Dirham marocain (MAD)', en: 'Moroccan Dirham (MAD)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '19',
      fire: '15',
      medical: '15'
    }
  },
  'CI': {
    name: { fr: 'Côte d\'Ivoire', en: 'Ivory Coast' },
    flag: '🇨🇮',
    currency: { fr: 'Franc CFA (XOF)', en: 'CFA Franc (XOF)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '111',
      fire: '180',
      medical: '185'
    }
  }
};

export function detectCountryFromPhone(phoneNumber: string): string {
  if (!phoneNumber) return 'SN'; // Défaut au Sénégal
  
  // Nettoyer le numéro de téléphone
  const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/[^\+\d]/g, '');
  
  // Rechercher l'indicatif le plus long qui correspond
  let detectedCountry = 'SN';
  let maxLength = 0;
  
  for (const [code, country] of Object.entries(phoneCountryMap)) {
    if (cleanPhone.startsWith(code) && code.length > maxLength) {
      detectedCountry = country;
      maxLength = code.length;
    }
  }
  
  return detectedCountry;
}

export function getCountryInfo(countryCode: string, language: 'fr' | 'en' = 'fr') {
  const info = countryInfo[countryCode];
  if (!info) {
    return {
      name: countryCode === 'SN' ? 'Sénégal' : 'Pays inconnu',
      flag: '🌍',
      currency: 'Monnaie inconnue',
      timezone: 'GMT+0',
      emergencyNumbers: {
        police: 'N/A',
        fire: 'N/A',
        medical: 'N/A'
      }
    };
  }
  
  return {
    name: info.name[language],
    flag: info.flag,
    currency: info.currency[language],
    timezone: info.timezone,
    emergencyNumbers: info.emergencyNumbers
  };
}

export function getAllCountries() {
  return Object.keys(countryInfo);
}
