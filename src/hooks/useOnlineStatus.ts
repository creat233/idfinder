import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOnlineStatus = (userId: string) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`presence-${userId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setIsOnline(Object.keys(state).includes(userId));
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key === userId) setIsOnline(true);
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key === userId) setIsOnline(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return isOnline;
};
