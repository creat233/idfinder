import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConnectedUsersCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const channel = supabase.channel('global-user-presence');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Each key in the presence state represents a unique user
        const uniqueUsers = Object.keys(state).filter(key => state[key]?.length > 0);
        setCount(uniqueUsers.length);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return count;
};
