// Configuration avancée du routage pour les cartes MCard
import { URL_CONFIG } from './urlConfig';

export const ROUTING_CONFIG = {
  // Routes de cartes MCard
  MCARD_ROUTES: ['/mcard/:slug', '/m/:slug'],
  
  // Vérifier si on est sur une route de carte
  isMCardRoute: (pathname: string): boolean => {
    return pathname.startsWith('/mcard/') || pathname.startsWith('/m/');
  },
  
  // Extraire le slug de l'URL
  extractSlugFromPath: (pathname: string): string | null => {
    const mcardMatch = pathname.match(/^\/mcard\/([^\/\?#]+)/);
    if (mcardMatch) return mcardMatch[1];
    
    const mMatch = pathname.match(/^\/m\/([^\/\?#]+)/);
    if (mMatch) return mMatch[1];
    
    return null;
  },
  
  // Rediriger vers l'URL canonique si nécessaire
  getCanonicalUrl: (slug: string): string => {
    return URL_CONFIG.getMCardUrl(slug);
  },
  
  // Vérifier si l'URL actuelle est canonical
  isCanonicalUrl: (currentUrl: string, slug: string): boolean => {
    const canonical = URL_CONFIG.getMCardUrl(slug);
    return currentUrl === canonical;
  },
  
  // Fonction pour traiter les redirections automatiques
  handleRouteRedirection: (pathname: string): string | null => {
    const slug = ROUTING_CONFIG.extractSlugFromPath(pathname);
    if (!slug) return null;
    
    // Si on est en développement (lovable.app), garder l'URL relative
    if (window.location.hostname.includes('lovable.app')) {
      return `/mcard/${slug}`;
    }
    
    // Si on est en production et pas sur l'URL canonique, rediriger
    const currentUrl = window.location.href;
    const canonicalUrl = ROUTING_CONFIG.getCanonicalUrl(slug);
    
    if (!ROUTING_CONFIG.isCanonicalUrl(currentUrl, slug)) {
      return canonicalUrl;
    }
    
    return null;
  }
};

// Middleware de routage pour React Router
export const useRouteMiddleware = () => {
  const checkAndRedirect = (pathname: string) => {
    const redirectUrl = ROUTING_CONFIG.handleRouteRedirection(pathname);
    if (redirectUrl && redirectUrl !== window.location.href) {
      window.location.href = redirectUrl;
      return true; // Indique qu'une redirection a eu lieu
    }
    return false;
  };
  
  return { checkAndRedirect };
};