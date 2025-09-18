import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, Lock } from "lucide-react";

export const SecurityStatus = () => {
  const [isSecure, setIsSecure] = useState(true);
  const [securityLevel, setSecurityLevel] = useState<'secure' | 'warning' | 'error'>('secure');

  useEffect(() => {
    const checkSecurity = () => {
      if (typeof window === 'undefined') return;
      
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      
      // Vérifier HTTPS
      const hasHttps = protocol === 'https:';
      
      // Vérifier si on est en production
      const isProduction = hostname === 'finderid.info' || hostname === 'www.finderid.info';
      
      // Vérifier les ressources mixtes
      const mixedContent = Array.from(document.querySelectorAll('img, script, link')).filter(el => {
        const element = el as HTMLImageElement | HTMLScriptElement | HTMLLinkElement;
        const src = ('src' in element ? element.src : null) || ('href' in element ? element.href : null);
        return src && src.startsWith('http:') && hasHttps;
      });
      
      if (!hasHttps && isProduction) {
        setSecurityLevel('error');
        setIsSecure(false);
      } else if (mixedContent.length > 0) {
        setSecurityLevel('warning');
        setIsSecure(false);
      } else {
        setSecurityLevel('secure');
        setIsSecure(true);
      }
    };

    // Vérification initiale
    checkSecurity();
    
    // Vérification périodique
    const interval = setInterval(checkSecurity, 30000);
    
    // Observer les changements dans le DOM
    const observer = new MutationObserver(checkSecurity);
    observer.observe(document.head, { childList: true, subtree: true });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // Afficher seulement en cas de problème de sécurité
  if (isSecure && securityLevel === 'secure') return null;

  const getIcon = () => {
    switch (securityLevel) {
      case 'error':
        return <ShieldAlert className="h-3 w-3" />;
      case 'warning':
        return <ShieldAlert className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  const getMessage = () => {
    switch (securityLevel) {
      case 'error':
        return 'Connexion non sécurisée';
      case 'warning':
        return 'Contenu mixte détecté';
      default:
        return 'Connexion sécurisée';
    }
  };

  const getVariant = () => {
    switch (securityLevel) {
      case 'error':
        return 'destructive' as const;
      case 'warning':
        return 'secondary' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <Badge variant={getVariant()} className="flex items-center gap-2">
        {getIcon()}
        {getMessage()}
      </Badge>
    </div>
  );
};