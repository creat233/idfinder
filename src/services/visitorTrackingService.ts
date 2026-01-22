import { supabase } from '@/integrations/supabase/client';

// Générer ou récupérer un ID visiteur unique
const getVisitorId = (): string => {
  const storageKey = 'visitor_id';
  let visitorId = localStorage.getItem(storageKey);
  
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(storageKey, visitorId);
  }
  
  return visitorId;
};

// Vérifier si cette page a déjà été trackée dans cette session
const hasTrackedPage = (path: string): boolean => {
  const trackedPages = JSON.parse(sessionStorage.getItem('tracked_pages') || '[]');
  return trackedPages.includes(path);
};

// Marquer la page comme trackée
const markPageAsTracked = (path: string): void => {
  const trackedPages = JSON.parse(sessionStorage.getItem('tracked_pages') || '[]');
  if (!trackedPages.includes(path)) {
    trackedPages.push(path);
    sessionStorage.setItem('tracked_pages', JSON.stringify(trackedPages));
  }
};

// Tracker une visite de page
export const trackPageVisit = async (pagePath: string): Promise<void> => {
  try {
    // Éviter les doublons dans la même session
    if (hasTrackedPage(pagePath)) {
      return;
    }

    const visitorId = getVisitorId();
    const referrer = document.referrer || null;
    const userAgent = navigator.userAgent || null;

    const { error } = await supabase
      .from('app_visits')
      .insert({
        visitor_id: visitorId,
        page_path: pagePath,
        referrer,
        user_agent: userAgent
      });

    if (error) {
      console.error('Error tracking page visit:', error);
      return;
    }

    markPageAsTracked(pagePath);
    console.log('📊 Page visit tracked:', pagePath);
  } catch (error) {
    console.error('Error in trackPageVisit:', error);
  }
};
