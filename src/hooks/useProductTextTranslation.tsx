import { useState } from 'react';
import { MCardProduct } from '@/types/mcard';

export type ProductTranslationLanguage = 'fr' | 'en';

type TranslatableProductFields = Pick<MCardProduct, 'name' | 'description' | 'category'>;

const PRODUCT_TRANSLATIONS: Record<string, Partial<Record<ProductTranslationLanguage, string>>> = {
  'Développeur': { en: 'Developer' },
  'Designer': { en: 'Designer' },
  'Manager': { en: 'Manager' },
  'Consultant': { en: 'Consultant' },
  'Ingénieur': { en: 'Engineer' },
  'Architecte': { en: 'Architect' },
  'Analyste': { en: 'Analyst' },
  'Chef de projet': { en: 'Project Manager' },
  'Directeur': { en: 'Director' },
  'Entrepreneur': { en: 'Entrepreneur' },
  'Entreprise': { en: 'Company' },
  'Société': { en: 'Corporation' },
  'Agence': { en: 'Agency' },
  'Studio': { en: 'Studio' },
  'Boutique': { en: 'Shop' },
  'Restaurant': { en: 'Restaurant' },
  'Salon': { en: 'Salon' },
  'Magasin': { en: 'Store' },
  'Spécialisé en': { en: 'Specialized in' },
  'Expert en': { en: 'Expert in' },
  'Passionné par': { en: 'Passionate about' },
  'Plus de': { en: 'More than' },
  "années d'expérience": { en: 'years of experience' },
  'Services': { en: 'Services' },
  'Service': { en: 'Service' },
  'Produits': { en: 'Products' },
  'Produit': { en: 'Product' },
  'Contact': { en: 'Contact' },
  'À propos': { en: 'About' },
  'Article': { en: 'Item' },
  'Menu restaurant': { en: 'Restaurant menu' },
  'Consultation': { en: 'Consultation' },
  'Formation': { en: 'Training' },
  'Événement': { en: 'Event' },
  "Offre d'emploi": { en: 'Job offer' },
  'Santé et beauté': { en: 'Health and beauty' },
  'Autre': { en: 'Other' },
  'Commander': { en: 'Order' },
  'Contacter': { en: 'Contact' },
  'Acheter': { en: 'Buy' },
  "Rendez-Vous": { en: 'Appointment' },
  "S'inscrire": { en: 'Register' },
  'Réserver': { en: 'Book' },
  'Voir tout': { en: 'See all' },
  'Tout': { en: 'All' },
  'Détails': { en: 'Details' },
  'Ajouter au panier': { en: 'Add to cart' },
  'Dans le panier': { en: 'In cart' },
  'Ajouté': { en: 'Added' },
  'Panier': { en: 'Cart' },
  'Rechercher...': { en: 'Search...' },
  'Catégories': { en: 'Categories' },
  'Tous': { en: 'All' },
  'Total produits': { en: 'Total products' },
  'Affichés': { en: 'Shown' },
  'Aucun produit trouvé': { en: 'No products found' },
  "Essayez avec d'autres mots-clés": { en: 'Try different keywords' },
  'Aucun produit dans cette catégorie': { en: 'No products in this category' },
  'Produits & Services': { en: 'Products & Services' },
  'De': { en: 'By' },
  'Détails du Produit': { en: 'Product details' },
  'Message': { en: 'Message' },
  'Pas encore de produits': { en: 'No products yet' },
  'Ajoutez votre premier produit ou service': { en: 'Add your first product or service' },
  'Ajouter un produit': { en: 'Add a product' },
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const translateProductText = (content: string | null | undefined, targetLang: ProductTranslationLanguage): string => {
  if (!content || targetLang === 'fr') return content || '';

  let translatedContent = content;

  Object.entries(PRODUCT_TRANSLATIONS).forEach(([original, translationMap]) => {
    const translatedValue = translationMap[targetLang];
    if (!translatedValue) return;

    const regex = new RegExp(escapeRegExp(original), 'gi');
    translatedContent = translatedContent.replace(regex, translatedValue);
  });

  return translatedContent;
};

export const translateProduct = <T extends TranslatableProductFields>(product: T, targetLang: ProductTranslationLanguage): T => ({
  ...product,
  name: translateProductText(product.name, targetLang),
  description: translateProductText(product.description, targetLang),
  category: translateProductText(product.category, targetLang),
});

export const useProductTextTranslation = (initialLanguage: ProductTranslationLanguage = 'fr') => {
  const [currentLanguage, setCurrentLanguage] = useState<ProductTranslationLanguage>(initialLanguage);

  return {
    currentLanguage,
    setCurrentLanguage,
    translateText: (text: string) => translateProductText(text, currentLanguage),
    translateProduct: <T extends TranslatableProductFields>(product: T) => translateProduct(product, currentLanguage),
    isTranslated: currentLanguage === 'en',
  };
};
