
// Informations détaillées des pays
export const countryInfo: Record<string, {
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
  },
  'CM': {
    name: { fr: 'Cameroun', en: 'Cameroon' },
    flag: '🇨🇲',
    currency: { fr: 'Franc CFA (XAF)', en: 'CFA Franc (XAF)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '117',
      fire: '118',
      medical: '119'
    }
  },
  'GA': {
    name: { fr: 'Gabon', en: 'Gabon' },
    flag: '🇬🇦',
    currency: { fr: 'Franc CFA (XAF)', en: 'CFA Franc (XAF)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '1730',
      fire: '18',
      medical: '1300'
    }
  },
  'CD': {
    name: { fr: 'RD Congo', en: 'DR Congo' },
    flag: '🇨🇩',
    currency: { fr: 'Franc congolais (CDF)', en: 'Congolese Franc (CDF)' },
    timezone: 'GMT+1',
    emergencyNumbers: {
      police: '112',
      fire: '118',
      medical: '112'
    }
  }
};
