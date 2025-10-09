import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserPresence = (userId: string | undefined) => {
  useEffect(() => {
    if (!userId) return;

    const channelName = `user-presence-${userId}`;
    
    const channel = supabase
      .channel(channelName, {
        config: {
          presence: {
            key: userId,
          },
        },
      })
      .on('presence', { event: 'sync' }, () => {
        console.log('User presence synced for:', userId);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track user as online with userId as key
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          });
          console.log('User tracked as online:', userId);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
};
