import { supabase } from '@/integrations/supabase/client';

// Types de notifications business
type BusinessNotificationType = 
  | 'new_message' 
  | 'new_appointment' 
  | 'new_sale' 
  | 'payment_received' 
  | 'new_client'
  | 'appointment_reminder'
  | 'payment_reminder';

interface CreateNotificationParams {
  userId: string;
  type: BusinessNotificationType;
  title: string;
  message: string;
  actionUrl?: string;
}

/**
 * Crée une notification dans la base de données
 */
export const createBusinessNotification = async ({
  userId,
  type,
  title,
  message,
  actionUrl
}: CreateNotificationParams): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        action_url: actionUrl,
        is_read: false
      });

    if (error) {
      console.error('Error creating business notification:', error);
      return false;
    }

    console.log(`✅ Notification business créée: ${type} pour ${userId}`);
    return true;
  } catch (error) {
    console.error('Error in createBusinessNotification:', error);
    return false;
  }
};

/**
 * Notifie le propriétaire d'une MCard d'un nouveau message
 */
export const notifyNewMessage = async (
  recipientId: string,
  senderName: string,
  subject: string,
  mcardSlug?: string
): Promise<void> => {
  await createBusinessNotification({
    userId: recipientId,
    type: 'new_message',
    title: '💬 Nouveau message',
    message: `${senderName} vous a envoyé un message: "${subject}"`,
    actionUrl: mcardSlug ? `/mcard/${mcardSlug}` : '/messages'
  });
};

/**
 * Notifie le propriétaire d'une demande de RDV
 */
export const notifyNewAppointment = async (
  ownerId: string,
  clientName: string,
  appointmentDate: string,
  mcardSlug?: string
): Promise<void> => {
  await createBusinessNotification({
    userId: ownerId,
    type: 'new_appointment',
    title: '📅 Nouvelle demande de RDV',
    message: `${clientName} souhaite prendre RDV le ${appointmentDate}`,
    actionUrl: mcardSlug ? `/mcard/${mcardSlug}` : '/messages'
  });
};

/**
 * Notifie le propriétaire d'une nouvelle vente
 */
export const notifyNewSale = async (
  ownerId: string,
  clientName: string,
  amount: number,
  currency: string = 'FCFA',
  mcardSlug?: string
): Promise<void> => {
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(amount);
  
  await createBusinessNotification({
    userId: ownerId,
    type: 'new_sale',
    title: '🎉 Nouvelle vente !',
    message: `${clientName} - ${formattedAmount} ${currency}`,
    actionUrl: mcardSlug ? `/mcard/${mcardSlug}` : undefined
  });
};

/**
 * Notifie le propriétaire d'un paiement reçu
 */
export const notifyPaymentReceived = async (
  ownerId: string,
  clientName: string,
  amount: number,
  currency: string = 'FCFA',
  invoiceNumber?: string
): Promise<void> => {
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(amount);
  
  await createBusinessNotification({
    userId: ownerId,
    type: 'payment_received',
    title: '💵 Paiement reçu',
    message: `${clientName} a payé ${formattedAmount} ${currency}${invoiceNumber ? ` (Facture #${invoiceNumber})` : ''}`,
    actionUrl: undefined
  });
};

/**
 * Notifie le propriétaire d'un nouveau client
 */
export const notifyNewClient = async (
  ownerId: string,
  clientName: string,
  source: string = 'facture'
): Promise<void> => {
  await createBusinessNotification({
    userId: ownerId,
    type: 'new_client',
    title: '👤 Nouveau client',
    message: `${clientName} a été ajouté à vos clients via ${source}`,
    actionUrl: undefined
  });
};

/**
 * Envoie un rappel de RDV
 */
export const sendAppointmentReminder = async (
  userId: string,
  appointmentDetails: string,
  appointmentDate: string
): Promise<void> => {
  await createBusinessNotification({
    userId,
    type: 'appointment_reminder',
    title: '⏰ Rappel de RDV',
    message: `Vous avez un RDV prévu: ${appointmentDetails} - ${appointmentDate}`,
    actionUrl: '/messages'
  });
};

/**
 * Envoie un rappel de paiement en attente
 */
export const sendPaymentReminder = async (
  ownerId: string,
  clientName: string,
  amount: number,
  daysOverdue: number
): Promise<void> => {
  const formattedAmount = new Intl.NumberFormat('fr-FR').format(amount);
  
  await createBusinessNotification({
    userId: ownerId,
    type: 'payment_reminder',
    title: '⚠️ Paiement en retard',
    message: `${clientName} doit ${formattedAmount} FCFA (${daysOverdue} jours de retard)`,
    actionUrl: undefined
  });
};
