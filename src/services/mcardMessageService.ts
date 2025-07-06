import { supabase } from '@/integrations/supabase/client';
import { MCardMessage } from '@/types/mcard-verification';

export const sendMessage = async (
  recipientId: string,
  mcardId: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const { error } = await supabase
      .from('mcard_messages')
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        mcard_id: mcardId,
        subject,
        message
      });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi du message:', error);
    return { success: false, error: error.message };
  }
};

export const getMessages = async (): Promise<MCardMessage[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('mcard_messages')
      .select(`
        *,
        mcards(full_name)
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(msg => ({
      ...msg,
      sender_name: 'Utilisateur',
      recipient_name: 'Utilisateur', 
      mcard_name: msg.mcards?.full_name || 'Carte supprimée'
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return [];
  }
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('mcard_messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors du marquage du message:', error);
  }
};

export const getUnreadMessageCount = async (): Promise<number> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data, error } = await supabase
      .from('mcard_messages')
      .select('id', { count: 'exact' })
      .eq('recipient_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
    return data?.length || 0;
  } catch (error) {
    console.error('Erreur lors du comptage des messages non lus:', error);
    return 0;
  }
};