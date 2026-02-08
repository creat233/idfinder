import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface BusinessNotification {
  id: string;
  type: 'new_message' | 'new_appointment' | 'new_sale' | 'payment_received' | 'new_client';
  title: string;
  message: string;
  timestamp: Date;
  data?: Record<string, unknown>;
  isRead: boolean;
}

export const useBusinessNotifications = (mcardId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [realtimeNotifications, setRealtimeNotifications] = useState<BusinessNotification[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  // Play distinct notification sounds based on business event type
  const playNotificationSound = useCallback((type?: BusinessNotification['type']) => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      gainNode.gain.setValueAtTime(0.35, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);

      const oscillator = audioContext.createOscillator();
      oscillator.connect(gainNode);

      switch (type) {
        case 'new_sale':
        case 'payment_received':
          // Cash register - celebratory ascending
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
          oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.3);
          oscillator.type = 'sine';
          break;
        case 'new_message':
          // Message ping - two gentle tones
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.15);
          oscillator.type = 'sine';
          break;
        case 'new_appointment':
          // Calendar chime - three soft bells
          oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.12);
          oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.24);
          oscillator.type = 'triangle';
          break;
        case 'new_client':
          // Welcome sound - warm ascending
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(554, audioContext.currentTime + 0.15);
          oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.3);
          oscillator.type = 'sine';
          break;
        default:
          oscillator.frequency.setValueAtTime(700, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(900, audioContext.currentTime + 0.15);
          oscillator.type = 'sine';
      }

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.6);
    } catch (error) {
      console.log('Audio notification not supported');
    }
  }, []);

  // Show push notification
  const showPushNotification = useCallback((notification: BusinessNotification) => {
    // Add to state
    setRealtimeNotifications(prev => [notification, ...prev.slice(0, 9)]);
    
    // Play sound
    playNotificationSound(notification.type);
    
    // Show toast
    const icons: Record<BusinessNotification['type'], string> = {
      new_message: '💬',
      new_appointment: '📅',
      new_sale: '💰',
      payment_received: '✅',
      new_client: '👤'
    };
    
    toast({
      title: `${icons[notification.type]} ${notification.title}`,
      description: notification.message,
      duration: 6000,
    });

    // Browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
      });
    }
  }, [playNotificationSound, toast]);

  // Request browser notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // Setup realtime subscriptions
  useEffect(() => {
    if (!user || !isEnabled) return;

    const channels: ReturnType<typeof supabase.channel>[] = [];

    // Listen for new messages
    const messagesChannel = supabase
      .channel('business_messages_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mcard_messages',
          filter: `recipient_id=eq.${user.id}`
        },
        async (payload) => {
          const newMessage = payload.new as {
            id: string;
            sender_id: string;
            subject: string;
            message: string;
            created_at: string;
          };
          
          // Get sender info
          const { data: senderCard } = await supabase
            .from('mcards')
            .select('full_name')
            .eq('user_id', newMessage.sender_id)
            .single();

          const notification: BusinessNotification = {
            id: `msg_${newMessage.id}`,
            type: 'new_message',
            title: 'Nouveau message reçu',
            message: `${senderCard?.full_name || 'Un visiteur'}: ${newMessage.subject || newMessage.message?.substring(0, 50)}...`,
            timestamp: new Date(newMessage.created_at),
            data: { messageId: newMessage.id },
            isRead: false
          };
          
          showPushNotification(notification);
        }
      )
      .subscribe();
    
    channels.push(messagesChannel);

    // Listen for new invoices (sales)
    if (mcardId) {
      const invoicesChannel = supabase
        .channel('business_invoices_realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'mcard_invoices',
            filter: `mcard_id=eq.${mcardId}`
          },
          (payload) => {
            const newInvoice = payload.new as {
              id: string;
              client_name: string;
              amount: number;
              currency: string;
              created_at: string;
            };
            
            const notification: BusinessNotification = {
              id: `sale_${newInvoice.id}`,
              type: 'new_sale',
              title: '🎉 Nouvelle vente !',
              message: `${newInvoice.client_name} - ${new Intl.NumberFormat('fr-FR').format(newInvoice.amount)} ${newInvoice.currency || 'FCFA'}`,
              timestamp: new Date(newInvoice.created_at),
              data: { invoiceId: newInvoice.id, amount: newInvoice.amount },
              isRead: false
            };
            
            showPushNotification(notification);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'mcard_invoices',
            filter: `mcard_id=eq.${mcardId}`
          },
          (payload) => {
            const updatedInvoice = payload.new as {
              id: string;
              client_name: string;
              amount: number;
              currency: string;
              is_validated: boolean;
              validated_at: string;
            };
            const oldInvoice = payload.old as { is_validated: boolean };
            
            // Only notify when invoice becomes validated (payment received)
            if (updatedInvoice.is_validated && !oldInvoice.is_validated) {
              const notification: BusinessNotification = {
                id: `payment_${updatedInvoice.id}`,
                type: 'payment_received',
                title: '💵 Paiement reçu !',
                message: `${updatedInvoice.client_name} a payé ${new Intl.NumberFormat('fr-FR').format(updatedInvoice.amount)} ${updatedInvoice.currency || 'FCFA'}`,
                timestamp: new Date(updatedInvoice.validated_at),
                data: { invoiceId: updatedInvoice.id, amount: updatedInvoice.amount },
                isRead: false
              };
              
              showPushNotification(notification);
            }
          }
        )
        .subscribe();
      
      channels.push(invoicesChannel);
    }

    // Listen for appointment requests (messages with specific subject)
    const appointmentsChannel = supabase
      .channel('business_appointments_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mcard_messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          const newMessage = payload.new as {
            id: string;
            subject: string;
            message: string;
            created_at: string;
          };
          
          // Check if it's an appointment request
          if (newMessage.subject?.includes('Demande de rendez-vous') || 
              newMessage.message?.includes('souhaite prendre rendez-vous')) {
            const notification: BusinessNotification = {
              id: `rdv_${newMessage.id}`,
              type: 'new_appointment',
              title: '📅 Nouvelle demande de RDV',
              message: newMessage.subject || 'Un client souhaite prendre rendez-vous',
              timestamp: new Date(newMessage.created_at),
              data: { messageId: newMessage.id },
              isRead: false
            };
            
            showPushNotification(notification);
          }
        }
      )
      .subscribe();
    
    channels.push(appointmentsChannel);

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [user, mcardId, isEnabled, showPushNotification]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setRealtimeNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setRealtimeNotifications([]);
  }, []);

  // Toggle notifications
  const toggleNotifications = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return {
    notifications: realtimeNotifications,
    unreadCount: realtimeNotifications.filter(n => !n.isRead).length,
    isEnabled,
    markAsRead,
    clearAll,
    toggleNotifications,
    requestNotificationPermission
  };
};
