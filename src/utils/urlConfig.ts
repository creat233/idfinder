
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

  // Rediriger vers www si nécessaire pour éviter les erreurs SSL
  ensureSecureDomain: () => {
    if (typeof window === 'undefined') return;
    
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Rediriger vers HTTPS avec www si nécessaire
    if (hostname === 'finderid.info' && protocol === 'http:') {
      window.location.replace(`https://www.finderid.info${window.location.pathname}${window.location.search}`);
    } else if (hostname === 'finderid.info' && protocol === 'https:') {
      window.location.replace(`https://www.finderid.info${window.location.pathname}${window.location.search}`);
    }
  },
  
  // Obtenir le domaine actuel
  getCurrentDomain: () => {
    if (typeof window === 'undefined') return 'localhost';
    return window.location.hostname;
  },
  
  // Générer l'URL complète pour une carte - TOUJOURS utiliser finderid.info
  getMCardUrl: (slug: string) => {
    // Forcer l'utilisation du domaine finderid.info pour tous les liens de cartes
    return `https://www.finderid.info/mcard/${slug}`;
  },
  
  // Générer l'URL pour le partage sur les réseaux sociaux
  getShareUrl: (slug: string) => {
    return URL_CONFIG.getMCardUrl(slug);
  },
  
  // Obtenir l'URL de base de l'application
  getBaseUrl: () => {
    const currentDomain = URL_CONFIG.getCurrentDomain();
    const protocol = window.location.protocol || URL_CONFIG.PROTOCOL;
    
    return `${protocol}//${currentDomain}`;
  },
  
  // Fonction utilitaire pour les liens internes (navigation)
  getInternalUrl: (path: string) => {
    // Pour la navigation interne, utiliser des liens relatifs
    return path.startsWith('/') ? path : `/${path}`;
  }
};
