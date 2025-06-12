
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
  '+299': 'GL', // Groenland
  '+222': 'MR', // Mauritanie
  '+224': 'GN', // Guinée
  '+220': 'GM', // Gambie
  '+32': 'BE',  // Belgique
  '+41': 'CH',  // Suisse
  '+351': 'PT', // Portugal
  '+31': 'NL'   // Pays-Bas
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
  'CA': {
    name: { fr: 'Canada', en: 'Canada' },
    flag: '🇨🇦',
    currency: { fr: 'Dollar canadien (CAD)', en: 'Canadian Dollar (CAD)' },
    timezone: 'GMT-3.5 to GMT-8',
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
  'DZ': {
    name: { fr: 'Algérie', en: 'Algeria' },
    flag: '🇩🇿',
    currency: { fr: 'Dinar algérien (DZD)', en: 'Algerian Dinar (DZD)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '17',
      fire: '14',
      medical: '14'
    }
  },
  'TN': {
    name: { fr: 'Tunisie', en: 'Tunisia' },
    flag: '🇹🇳',
    currency: { fr: 'Dinar tunisien (TND)', en: 'Tunisian Dinar (TND)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '197',
      fire: '198',
      medical: '190'
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
  },
  'ML': {
    name: { fr: 'Mali', en: 'Mali' },
    flag: '🇲🇱',
    currency: { fr: 'Franc CFA (XOF)', en: 'CFA Franc (XOF)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '17',
      fire: '18',
      medical: '15'
    }
  },
  'BF': {
    name: { fr: 'Burkina Faso', en: 'Burkina Faso' },
    flag: '🇧🇫',
    currency: { fr: 'Franc CFA (XOF)', en: 'CFA Franc (XOF)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '17',
      fire: '18',
      medical: '3535'
    }
  },
  'NE': {
    name: { fr: 'Niger', en: 'Niger' },
    flag: '🇳🇪',
    currency: { fr: 'Franc CFA (XOF)', en: 'CFA Franc (XOF)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '17',
      fire: '18',
      medical: '15'
    }
  },
  'GN': {
    name: { fr: 'Guinée', en: 'Guinea' },
    flag: '🇬🇳',
    currency: { fr: 'Franc guinéen (GNF)', en: 'Guinean Franc (GNF)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '117',
      fire: '118',
      medical: '144'
    }
  },
  'MR': {
    name: { fr: 'Mauritanie', en: 'Mauritania' },
    flag: '🇲🇷',
    currency: { fr: 'Ouguiya (MRU)', en: 'Ouguiya (MRU)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '17',
      fire: '18',
      medical: '15'
    }
  },
  'GM': {
    name: { fr: 'Gambie', en: 'Gambia' },
    flag: '🇬🇲',
    currency: { fr: 'Dalasi (GMD)', en: 'Dalasi (GMD)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '117',
      fire: '118',
      medical: '116'
    }
  },
  'GW': {
    name: { fr: 'Guinée-Bissau', en: 'Guinea-Bissau' },
    flag: '🇬🇼',
    currency: { fr: 'Franc CFA (XOF)', en: 'CFA Franc (XOF)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '117',
      fire: '118',
      medical: '119'
    }
  },
  'CV': {
    name: { fr: 'Cap-Vert', en: 'Cape Verde' },
    flag: '🇨🇻',
    currency: { fr: 'Escudo cap-verdien (CVE)', en: 'Cape Verdean Escudo (CVE)' },
    timezone: 'GMT-1',
    emergencyNumbers: {
      police: '132',
      fire: '131',
      medical: '130'
    }
  },
  'LR': {
    name: { fr: 'Libéria', en: 'Liberia' },
    flag: '🇱🇷',
    currency: { fr: 'Dollar libérien (LRD)', en: 'Liberian Dollar (LRD)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '911',
      fire: '911',
      medical: '911'
    }
  },
  'SL': {
    name: { fr: 'Sierra Leone', en: 'Sierra Leone' },
    flag: '🇸🇱',
    currency: { fr: 'Leone (SLL)', en: 'Leone (SLL)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '019',
      fire: '019',
      medical: '999'
    }
  },
  'GH': {
    name: { fr: 'Ghana', en: 'Ghana' },
    flag: '🇬🇭',
    currency: { fr: 'Cedi ghanéen (GHS)', en: 'Ghanaian Cedi (GHS)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '191',
      fire: '192',
      medical: '193'
    }
  },
  'TG': {
    name: { fr: 'Togo', en: 'Togo' },
    flag: '🇹🇬',
    currency: { fr: 'Franc CFA (XOF)', en: 'CFA Franc (XOF)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '117',
      fire: '118',
      medical: '8200'
    }
  },
  'BJ': {
    name: { fr: 'Bénin', en: 'Benin' },
    flag: '🇧🇯',
    currency: { fr: 'Franc CFA (XOF)', en: 'CFA Franc (XOF)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '117',
      fire: '118',
      medical: '112'
    }
  },
  'NG': {
    name: { fr: 'Nigeria', en: 'Nigeria' },
    flag: '🇳🇬',
    currency: { fr: 'Naira (NGN)', en: 'Naira (NGN)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '199',
      fire: '199',
      medical: '199'
    }
  },
  'ES': {
    name: { fr: 'Espagne', en: 'Spain' },
    flag: '🇪🇸',
    currency: { fr: 'Euro (EUR)', en: 'Euro (EUR)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '091',
      fire: '080',
      medical: '112'
    }
  },
  'IT': {
    name: { fr: 'Italie', en: 'Italy' },
    flag: '🇮🇹',
    currency: { fr: 'Euro (EUR)', en: 'Euro (EUR)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '113',
      fire: '115',
      medical: '118'
    }
  },
  'DE': {
    name: { fr: 'Allemagne', en: 'Germany' },
    flag: '🇩🇪',
    currency: { fr: 'Euro (EUR)', en: 'Euro (EUR)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '110',
      fire: '112',
      medical: '112'
    }
  },
  'BE': {
    name: { fr: 'Belgique', en: 'Belgium' },
    flag: '🇧🇪',
    currency: { fr: 'Euro (EUR)', en: 'Euro (EUR)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '101',
      fire: '112',
      medical: '112'
    }
  },
  'CH': {
    name: { fr: 'Suisse', en: 'Switzerland' },
    flag: '🇨🇭',
    currency: { fr: 'Franc suisse (CHF)', en: 'Swiss Franc (CHF)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '117',
      fire: '118',
      medical: '144'
    }
  },
  'PT': {
    name: { fr: 'Portugal', en: 'Portugal' },
    flag: '🇵🇹',
    currency: { fr: 'Euro (EUR)', en: 'Euro (EUR)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '112',
      fire: '112',
      medical: '112'
    }
  },
  'NL': {
    name: { fr: 'Pays-Bas', en: 'Netherlands' },
    flag: '🇳🇱',
    currency: { fr: 'Euro (EUR)', en: 'Euro (EUR)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '112',
      fire: '112',
      medical: '112'
    }
  },
  'GB': {
    name: { fr: 'Royaume-Uni', en: 'United Kingdom' },
    flag: '🇬🇧',
    currency: { fr: 'Livre sterling (GBP)', en: 'British Pound (GBP)' },
    timezone: 'GMT+0',
    emergencyNumbers: {
      police: '999',
      fire: '999',
      medical: '999'
    }
  },
  'LY': {
    name: { fr: 'Libye', en: 'Libya' },
    flag: '🇱🇾',
    currency: { fr: 'Dinar libyen (LYD)', en: 'Libyan Dinar (LYD)' },
    timezone: 'GMT+2',
    emergencyNumbers: {
      police: '1515',
      fire: '180',
      medical: '193'
    }
  },
  'EG': {
    name: { fr: 'Égypte', en: 'Egypt' },
    flag: '🇪🇬',
    currency: { fr: 'Livre égyptienne (EGP)', en: 'Egyptian Pound (EGP)' },
    timezone: 'GMT+2',
    emergencyNumbers: {
      police: '122',
      fire: '180',
      medical: '123'
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
