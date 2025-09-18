
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
    if (protocol === 'http:') {
      window.location.replace(`https://www.finderid.info${window.location.pathname}${window.location.search}`);
    } else if (hostname === 'finderid.info') {
      window.location.replace(`https://www.finderid.info${window.location.pathname}${window.location.search}`);
    }
  },

  // Vérifier la sécurité de la connexion
  checkSecureConnection: () => {
    if (typeof window === 'undefined') return true;
    
    const isSecure = window.location.protocol === 'https:' || 
                    window.location.hostname === 'localhost' ||
                    window.location.hostname.includes('lovable.app');
    
    return isSecure;
  },

  // Initialiser la sécurité
  initSecurity: () => {
    if (typeof window === 'undefined') return;
    
    // Forcer HTTPS en production
    if (URL_CONFIG.isProduction() && !URL_CONFIG.checkSecureConnection()) {
      URL_CONFIG.ensureSecureDomain();
    }
    
    // Ajouter des headers de sécurité via meta tags
    URL_CONFIG.addSecurityHeaders();
    
    // Désactiver le clic droit en production pour plus de sécurité
    if (URL_CONFIG.isProduction()) {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      document.addEventListener('selectstart', (e) => e.preventDefault());
      document.addEventListener('dragstart', (e) => e.preventDefault());
    }
    
    // Surveiller les changements de protocole
    URL_CONFIG.monitorSecurity();
  },

  // Ajouter des headers de sécurité
  addSecurityHeaders: () => {
    if (typeof document === 'undefined') return;
    
    // Supprimer les anciens headers de sécurité
    const existingMetas = document.querySelectorAll('meta[name="security"], meta[http-equiv*="Security"], meta[http-equiv*="Content-Security"]');
    existingMetas.forEach(meta => meta.remove());
    
    // Content Security Policy renforcée
    const csp = document.createElement('meta');
    csp.httpEquiv = 'Content-Security-Policy';
    csp.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https://jrnznosfclfepqdxyhjh.supabase.co wss://jrnznosfclfepqdxyhjh.supabase.co https:; frame-ancestors 'self'; upgrade-insecure-requests";
    document.head.appendChild(csp);

    // Strict Transport Security
    const hsts = document.createElement('meta');
    hsts.httpEquiv = 'Strict-Transport-Security';
    hsts.content = 'max-age=31536000; includeSubDomains; preload';
    document.head.appendChild(hsts);

    // X-Frame-Options
    const frameOptions = document.createElement('meta');
    frameOptions.httpEquiv = 'X-Frame-Options';
    frameOptions.content = 'SAMEORIGIN';
    document.head.appendChild(frameOptions);

    // X-Content-Type-Options
    const contentType = document.createElement('meta');
    contentType.httpEquiv = 'X-Content-Type-Options';
    contentType.content = 'nosniff';
    document.head.appendChild(contentType);

    // Referrer Policy
    const referrer = document.createElement('meta');
    referrer.name = 'referrer';
    referrer.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrer);

    // Permissions Policy
    const permissions = document.createElement('meta');
    permissions.httpEquiv = 'Permissions-Policy';
    permissions.content = 'geolocation=(), microphone=(), camera=()';
    document.head.appendChild(permissions);
  },

  // Surveiller la sécurité
  monitorSecurity: () => {
    if (typeof window === 'undefined') return;
    
    // Vérifier périodiquement la sécurité
    const securityInterval = setInterval(() => {
      // Vérifier le protocole
      if (window.location.protocol !== 'https:' && URL_CONFIG.isProduction()) {
        console.warn('🔒 Protocole non sécurisé détecté, redirection...');
        URL_CONFIG.ensureSecureDomain();
      }
      
      // Vérifier les ressources mixtes
      const mixedContent = Array.from(document.querySelectorAll('img, script, link')).filter(el => {
        const element = el as HTMLImageElement | HTMLScriptElement | HTMLLinkElement;
        const src = ('src' in element ? element.src : null) || ('href' in element ? element.href : null);
        return src && src.startsWith('http:') && window.location.protocol === 'https:';
      });
      
      if (mixedContent.length > 0) {
        console.warn('🔒 Contenu mixte détecté:', mixedContent);
      }
    }, 10000);

    // Nettoyer lors du déchargement de la page
    window.addEventListener('beforeunload', () => {
      clearInterval(securityInterval);
    });
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
