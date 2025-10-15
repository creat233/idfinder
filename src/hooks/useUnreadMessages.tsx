import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUnreadMessages = (user: any) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('mcard_messages')
        .select('id', { count: 'exact' })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setUnreadCount(data?.length || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des messages non lus:', error);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (user) {
      loadUnreadCount();

      // Écouter l'événement personnalisé pour recharger immédiatement
      const handleMessagesRead = () => {
        console.log('🔄 Rechargement du compteur de messages non lus...');
        loadUnreadCount();
      };
      window.addEventListener('messagesMarkedAsRead', handleMessagesRead);

      // Écouter les changements de messages en temps réel
      const channel = supabase
        .channel('unread-messages-count')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'mcard_messages'
          },
          (payload) => {
            const newMessage = payload.new as any;
            const oldMessage = payload.old as any;
            
            // Si c'est un nouveau message pour cet utilisateur ou un message marqué comme lu/non lu
            if (
              (payload.eventType === 'INSERT' && newMessage?.recipient_id === user.id) ||
              (payload.eventType === 'UPDATE' && (newMessage?.recipient_id === user.id || oldMessage?.recipient_id === user.id)) ||
              (payload.eventType === 'DELETE' && oldMessage?.recipient_id === user.id)
            ) {
              loadUnreadCount();
            }
          }
        )
        .subscribe();

      return () => {
        window.removeEventListener('messagesMarkedAsRead', handleMessagesRead);
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    unreadCount,
    loadUnreadCount
  };
};