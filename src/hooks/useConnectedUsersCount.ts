import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConnectedUsersCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const channel = supabase.channel('admin-presence-monitor', {
      config: { presence: { key: 'global' } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Count all unique user_ids across all presence keys
        const allPresences = Object.values(state).flat();
        const uniqueUsers = new Set(
          allPresences.map((p: any) => p.user_id).filter(Boolean)
        );
        setCount(uniqueUsers.size);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return count;
};
