import { supabase } from "@/integrations/supabase/client";

interface AutoReplySettings {
  enabled: boolean;
  selectedMessage: string;
  customMessage: string;
}

const PREDEFINED_MESSAGES: Record<string, string> = {
  vacation: "Bonjour ! Je suis actuellement en vacances et ne suis pas disponible. Je vous répondrai dès mon retour. Merci de votre patience !",
  busy: "Bonjour ! Je suis actuellement occupé et ne peux pas répondre immédiatement. Je vous contacterai dès que possible.",
  away: "Bonjour ! Je suis temporairement absent. Je reviendrai vers vous très prochainement. Merci pour votre message !",
  weekend: "Bonjour ! C'est le week-end et je ne consulte pas mes messages. Je vous répondrai dès lundi. Bon week-end !"
};

export const getAutoReplySettings = (userId: string): AutoReplySettings | null => {
  const savedSettings = localStorage.getItem(`autoReply_${userId}`);
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch {
      return null;
    }
  }
  return null;
};

export const getAutoReplyMessage = (userId: string): string | null => {
  const settings = getAutoReplySettings(userId);
  if (!settings || !settings.enabled) return null;

  if (settings.selectedMessage === "custom") {
    return settings.customMessage || null;
  }
  return PREDEFINED_MESSAGES[settings.selectedMessage] || null;
};

export const sendAutoReply = async (
  recipientId: string,
  senderId: string,
  mcardId: string,
  autoReplyMessage: string
): Promise<boolean> => {
  try {
    // Vérifier si un message d'absence a déjà été envoyé récemment (dans les dernières 24h)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: recentAutoReplies } = await supabase
      .from('mcard_messages')
      .select('id')
      .eq('sender_id', recipientId)
      .eq('recipient_id', senderId)
      .eq('subject', '[Auto-réponse]')
      .gte('created_at', twentyFourHoursAgo)
      .limit(1);

    // Ne pas renvoyer d'auto-réponse si une a déjà été envoyée
    if (recentAutoReplies && recentAutoReplies.length > 0) {
      console.log('Auto-reply already sent within 24 hours');
      return false;
    }

    // Envoyer le message d'absence
    const { error } = await supabase
      .from('mcard_messages')
      .insert({
        sender_id: recipientId,
        recipient_id: senderId,
        mcard_id: mcardId,
        subject: '[Auto-réponse]',
        message: autoReplyMessage
      });

    if (error) {
      console.error('Error sending auto-reply:', error);
      return false;
    }

    console.log('Auto-reply sent successfully');
    return true;
  } catch (error) {
    console.error('Error in sendAutoReply:', error);
    return false;
  }
};
