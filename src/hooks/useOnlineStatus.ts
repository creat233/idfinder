import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOnlineStatus = (userId: string) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const channelName = `user-presence-${userId}`;
    
    const channel = supabase
      .channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const presenceData = state[userId];
        setIsOnline(!!presenceData && presenceData.length > 0);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key === userId) setIsOnline(true);
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key === userId) setIsOnline(false);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track initial presence
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

  return isOnline;
};
