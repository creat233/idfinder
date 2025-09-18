import { useEffect } from 'react';
import { URL_CONFIG } from '@/utils/urlConfig';

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  useEffect(() => {
    // Initialiser la sécurité au chargement
    URL_CONFIG.initSecurity();

    // Ajouter des headers de sécurité via meta tags
    const addSecurityMeta = () => {
      // Content Security Policy
      const csp = document.createElement('meta');
      csp.httpEquiv = 'Content-Security-Policy';
      csp.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://jrnznosfclfepqdxyhjh.supabase.co wss://jrnznosfclfepqdxyhjh.supabase.co";
      document.head.appendChild(csp);

      // Referrer Policy
      const referrer = document.createElement('meta');
      referrer.name = 'referrer';
      referrer.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrer);

      // X-Frame-Options
      const frameOptions = document.createElement('meta');
      frameOptions.httpEquiv = 'X-Frame-Options';
      frameOptions.content = 'SAMEORIGIN';
      document.head.appendChild(frameOptions);
    };

    addSecurityMeta();

    // Vérifier périodiquement la sécurité de la connexion
    const securityCheck = setInterval(() => {
      if (!URL_CONFIG.checkSecureConnection() && URL_CONFIG.isProduction()) {
        console.warn('Connexion non sécurisée détectée, redirection...');
        URL_CONFIG.ensureSecureDomain();
      }
    }, 30000); // Vérifier toutes les 30 secondes

    return () => {
      clearInterval(securityCheck);
    };
  }, []);

  return <>{children}</>;
};