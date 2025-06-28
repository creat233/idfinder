
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNotificationCleanup = () => {
  useEffect(() => {
    const cleanupOldNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Supprimer les notifications de plus de 24 heures
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const { error } = await supabase
          .from('notifications')
          .delete()
          .eq('user_id', user.id)
          .lt('created_at', twentyFourHoursAgo.toISOString());

        if (error) {
          console.error('Erreur lors du nettoyage des notifications:', error);
        } else {
          console.log('✅ Notifications anciennes supprimées automatiquement');
        }
      } catch (error) {
        console.error('Erreur lors du nettoyage automatique des notifications:', error);
      }
    };

    // Nettoyer immédiatement au chargement
    cleanupOldNotifications();

    // Puis nettoyer toutes les 30 minutes
    const interval = setInterval(cleanupOldNotifications, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};
