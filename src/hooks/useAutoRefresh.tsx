
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useAutoRefresh = (intervalMs: number = 30000) => {
  const location = useLocation();
  const lastLocationRef = useRef(location.pathname);
  
  useEffect(() => {
    // Si l'utilisateur change de page, on reset le timer
    if (lastLocationRef.current !== location.pathname) {
      lastLocationRef.current = location.pathname;
      return;
    }

    // Éviter les rafraîchissements automatiques trop fréquents
    if (intervalMs < 30000) {
      console.warn('Auto-refresh interval too short, using minimum 30 seconds');
      return;
    }

    const interval = setInterval(() => {
      // On rafraîchit seulement si l'utilisateur est actif (page visible)
      if (!document.hidden) {
        console.log('Auto-refreshing application...');
        window.location.reload();
      }
    }, intervalMs);

    // Rafraîchir aussi quand la page redevient visible après être cachée
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          console.log('Page became visible, refreshing...');
          window.location.reload();
        }, 1000); // Petit délai pour éviter les rafraîchissements trop rapides
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, intervalMs]);
};
