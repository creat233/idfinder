import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Canal global partagé pour toutes les présences
let globalPresenceChannel: RealtimeChannel | null = null;
let subscriberCount = 0;
const presenceCallbacks = new Map<string, Set<(isOnline: boolean) => void>>();

const getOrCreatePresenceChannel = () => {
  if (!globalPresenceChannel) {
    console.log('🔄 Creating global presence channel');
    globalPresenceChannel = supabase.channel('global-user-presence', {
      config: {
        presence: {
          key: '', // Will be set per user
        },
      },
    });

    globalPresenceChannel
      .on('presence', { event: 'sync' }, () => {
        console.log('✅ Presence synced');
        const state = globalPresenceChannel?.presenceState();
        console.log('📊 Current presence state:', state);
        
        // Notify all subscribers about presence changes
        if (state) {
          presenceCallbacks.forEach((callbacks, userId) => {
            const isUserOnline = state[userId] && state[userId].length > 0;
            callbacks.forEach(callback => callback(isUserOnline));
          });
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('👋 User joined:', key, newPresences);
        const callbacks = presenceCallbacks.get(key);
        if (callbacks) {
          callbacks.forEach(callback => callback(true));
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('👋 User left:', key, leftPresences);
        const callbacks = presenceCallbacks.get(key);
        if (callbacks) {
          callbacks.forEach(callback => callback(false));
        }
      })
      .subscribe();
  }
  
  return globalPresenceChannel;
};

export const useUserPresence = (userId: string | undefined) => {
  useEffect(() => {
    if (!userId) return;

    subscriberCount++;
    const channel = getOrCreatePresenceChannel();
    
    console.log(`🟢 Tracking presence for user: ${userId}`);

    const trackPresence = async () => {
      if (channel) {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
        console.log(`✅ User ${userId} tracked as online`);
      }
    };

    // Track presence immediately if channel is already subscribed
    if (channel.state === 'joined') {
      trackPresence();
    } else {
      // Wait for subscription
      const checkSubscription = setInterval(() => {
        if (channel.state === 'joined') {
          trackPresence();
          clearInterval(checkSubscription);
        }
      }, 100);

      setTimeout(() => clearInterval(checkSubscription), 5000);
    }

    return () => {
      subscriberCount--;
      console.log(`🔴 Stopping presence tracking for user: ${userId}`);
      
      // Untrack this user's presence
      if (channel) {
        channel.untrack();
      }

      // If no more subscribers, remove the channel
      if (subscriberCount === 0 && globalPresenceChannel) {
        console.log('🗑️ Removing global presence channel');
        supabase.removeChannel(globalPresenceChannel);
        globalPresenceChannel = null;
      }
    };
  }, [userId]);
};

export const useOnlineStatus = (userId: string) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsOnline(false);
      return;
    }

    const channel = getOrCreatePresenceChannel();
    
    console.log(`👀 Watching online status for user: ${userId}`);

    // Register callback for this user
    if (!presenceCallbacks.has(userId)) {
      presenceCallbacks.set(userId, new Set());
    }
    presenceCallbacks.get(userId)?.add(setIsOnline);

    // Check initial state
    const checkInitialState = () => {
      if (channel.state === 'joined') {
        const state = channel.presenceState();
        console.log(`📊 Initial state check for ${userId}:`, state);
        const isUserOnline = state[userId] && state[userId].length > 0;
        setIsOnline(isUserOnline);
      }
    };

    if (channel.state === 'joined') {
      checkInitialState();
    } else {
      const checkInterval = setInterval(() => {
        if (channel.state === 'joined') {
          checkInitialState();
          clearInterval(checkInterval);
        }
      }, 100);

      setTimeout(() => clearInterval(checkInterval), 5000);
    }

    return () => {
      console.log(`👋 Stopped watching online status for user: ${userId}`);
      presenceCallbacks.get(userId)?.delete(setIsOnline);
      
      // Clean up empty callback sets
      if (presenceCallbacks.get(userId)?.size === 0) {
        presenceCallbacks.delete(userId);
      }
    };
  }, [userId]);

  return isOnline;
};
