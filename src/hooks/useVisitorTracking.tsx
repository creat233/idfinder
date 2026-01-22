import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageVisit } from '@/services/visitorTrackingService';

export const useVisitorTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Tracker la visite de la page actuelle
    trackPageVisit(location.pathname);
  }, [location.pathname]);
};
