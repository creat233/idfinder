import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;
    
    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      await registerServiceWorker();
      return true;
    }
    return false;
  }, [isSupported]);

  const registerServiceWorker = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      setIsSubscribed(true);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }, []);

  const sendBrowserNotification = useCallback((title: string, body: string, url?: string) => {
    if (permission !== 'granted') return;
    
    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `notif-${Date.now()}`,
        requireInteraction: true,
        data: { url: url || '/' }
      });

      notification.onclick = () => {
        window.focus();
        if (url) {
          window.location.href = url;
        }
        notification.close();
      };
    } catch (error) {
      console.log('Browser notification failed:', error);
    }
  }, [permission]);

  return {
    isSupported,
    isSubscribed,
    permission,
    requestPermission,
    sendBrowserNotification
  };
};
