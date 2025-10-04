import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserPresence = (userId: string | undefined) => {
  useEffect(() => {
    if (!userId) return;

    const channelName = `user-presence-${userId}`;
    
    const channel = supabase
      .channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence synced');
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track user as online
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
};
