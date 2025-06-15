import { Country } from './translations';

export interface PriceInfo {
  baseFee: number;
  currency: string;
  symbol: string;
}

const pricingByCountry: Partial<Record<Country, PriceInfo>> = {
  // West Africa (FCFA)
  SN: { baseFee: 7000, currency: 'FCFA', symbol: 'FCFA' },
  CI: { baseFee: 7000, currency: 'FCFA', symbol: 'FCFA' },
  ML: { baseFee: 7000, currency: 'FCFA', symbol: 'FCFA' },
  BF: { baseFee: 7000, currency: 'FCFA', symbol: 'FCFA' },
  NE: { baseFee: 7000, currency: 'FCFA', symbol: 'FCFA' },
  TG: { baseFee: 7000, currency: 'FCFA', symbol: 'FCFA' },
  BJ: { baseFee: 7000, currency: 'FCFA', symbol: 'FCFA' },
  GW: { baseFee: 7000, currency: 'FCFA', symbol: 'FCFA' }, // Guinea-Bissau
  // Other Africa
  GN: { baseFee: 100000, currency: 'GNF', symbol: 'GNF' }, // Guinea
  MR: { baseFee: 400, currency: 'MRU', symbol: 'MRU' }, // Mauritania
  GM: { baseFee: 450, currency: 'GMD', symbol: 'GMD' }, // Gambia
  SL: { baseFee: 150, currency: 'SLL', symbol: 'Le' }, // Sierra Leone
  LR: { baseFee: 2000, currency: 'LRD', symbol: 'L$' }, // Liberia
  GH: { baseFee: 100, currency: 'GHS', symbol: 'GH₵' }, // Ghana
  NG: { baseFee: 10000, currency: 'NGN', symbol: '₦' }, // Nigeria
  MA: { baseFee: 100, currency: 'MAD', symbol: 'MAD' }, // Morocco
  DZ: { baseFee: 1500, currency: 'DZD', symbol: 'DZD' }, // Algeria
  TN: { baseFee: 30, currency: 'TND', symbol: 'TND' }, // Tunisia
  EG: { baseFee: 300, currency: 'EGP', symbol: 'E£' }, // Egypt
  LY: { baseFee: 50, currency: 'LYD', symbol: 'LD' }, // Libya
  // Europe (€)
  FR: { baseFee: 15, currency: 'EUR', symbol: '€' },
  ES: { baseFee: 15, currency: 'EUR', symbol: '€' },
  IT: { baseFee: 15, currency: 'EUR', symbol: '€' },
  DE: { baseFee: 15, currency: 'EUR', symbol: '€' },
  BE: { baseFee: 15, currency: 'EUR', symbol: '€' },
  PT: { baseFee: 15, currency: 'EUR', symbol: '€' },
  NL: { baseFee: 15, currency: 'EUR', symbol: '€' },
  // Other Europe
  CH: { baseFee: 15, currency: 'CHF', symbol: 'CHF' }, // Switzerland
  GB: { baseFee: 12, currency: 'GBP', symbol: '£' }, // UK
  // Americas
  CA: { baseFee: 20, currency: 'CAD', symbol: 'CA$' },
  US: { baseFee: 15, currency: 'USD', symbol: '$' },
  // Default / Other
  CV: { baseFee: 1500, currency: 'CVE', symbol: 'CVE' }, // Cape Verde
};

const defaultPrice: PriceInfo = { baseFee: 7000, currency: 'FCFA', symbol: 'FCFA' };

export const getPriceInfoForCountry = (country: Country): PriceInfo => {
  return pricingByCountry[country] || defaultPrice;
};
