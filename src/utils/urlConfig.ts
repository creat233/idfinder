// Configuration des domaines et URLs pour les cartes
export const URL_CONFIG = {
  // Domaine principal de l'application
  MAIN_DOMAIN: 'www.finderid.info',
  
  // Domaine de développement
  DEV_DOMAIN: 'lovable.app',
  
  // Protocole par défaut
  PROTOCOL: 'https://',
  
  // Vérifier si on est en production
  isProduction: () => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname === 'www.finderid.info' || 
           window.location.hostname === 'finderid.info';
  },
  
  // Obtenir le domaine actuel
  getCurrentDomain: () => {
    if (typeof window === 'undefined') return 'localhost';
    return window.location.hostname;
  },
  
  // Générer l'URL complète pour une carte
  getMCardUrl: (slug: string) => {
    const isProduction = URL_CONFIG.isProduction();
    const domain = isProduction ? URL_CONFIG.MAIN_DOMAIN : URL_CONFIG.getCurrentDomain();
    const protocol = URL_CONFIG.PROTOCOL;
    
    return `${protocol}${domain}/mcard/${slug}`;
  },
  
  // Générer l'URL pour le partage sur les réseaux sociaux
  getShareUrl: (slug: string) => {
    return URL_CONFIG.getMCardUrl(slug);
  },
  
  // Obtenir l'URL de base de l'application
  getBaseUrl: () => {
    const isProduction = URL_CONFIG.isProduction();
    const domain = isProduction ? URL_CONFIG.MAIN_DOMAIN : URL_CONFIG.getCurrentDomain();
    const protocol = URL_CONFIG.PROTOCOL;
    
    return `${protocol}${domain}`;
  }
};