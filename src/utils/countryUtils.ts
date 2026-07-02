
import { phoneCountryMap } from "@/data/phoneCountryMap";
import { countryInfo } from "@/data/countryInfo";

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

export function getCountryInfo(countryCode: string, language: string = 'fr') {
  const info = countryInfo[countryCode];
  const lang: 'fr' | 'en' = language === 'en' ? 'en' : 'fr';
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
    name: info.name[lang],
    flag: info.flag,
    currency: info.currency[lang],
    timezone: info.timezone,
    emergencyNumbers: info.emergencyNumbers
  };
}

export function getAllCountries() {
  return Object.keys(countryInfo);
}
