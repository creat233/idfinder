import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Conversation, ProcessedMessage } from "@/types/messages";

export const useConversations = (user: any) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('mcard_messages')
        .select(`
          *,
          mcards!mcard_messages_mcard_id_fkey(full_name)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Récupérer les noms des utilisateurs
      const userIds = [...new Set([...data?.map(msg => msg.sender_id) || [], ...data?.map(msg => msg.recipient_id) || []])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      const processedMessages: ProcessedMessage[] = data?.map((msg: any) => {
        const senderProfile = profiles?.find(p => p.id === msg.sender_id);
        const recipientProfile = profiles?.find(p => p.id === msg.recipient_id);
        
        return {
          ...msg,
          sender_name: senderProfile ? `${senderProfile.first_name || ''} ${senderProfile.last_name || ''}`.trim() || 'Utilisateur' : 'Utilisateur',
          recipient_name: recipientProfile ? `${recipientProfile.first_name || ''} ${recipientProfile.last_name || ''}`.trim() || 'Utilisateur' : 'Utilisateur',
          mcard_name: msg.mcards?.full_name || 'Carte supprimée'
        };
      }) || [];

      // Grouper les messages par conversation (par utilisateur uniquement, pas par mcard)
      const conversationsMap = new Map<string, Conversation>();
      
      processedMessages.forEach((msg: ProcessedMessage) => {
        const otherUserId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
        const otherUserName = msg.sender_id === user.id ? msg.recipient_name : msg.sender_name;
        // Utiliser seulement l'userId pour regrouper, pas le mcard_id
        const key = otherUserId;
        
        if (!conversationsMap.has(key)) {
          conversationsMap.set(key, {
            otherUserId,
            otherUserName,
            mcardId: msg.mcard_id,
            mcardName: msg.mcard_name,
            messages: [],
            lastMessage: msg,
            unreadCount: 0
          });
        }
        
        const conversation = conversationsMap.get(key)!;
        conversation.messages.push(msg);
        
        // Compter les messages non lus reçus
        if (msg.recipient_id === user.id && !msg.is_read) {
          conversation.unreadCount++;
        }
        
        // Mettre à jour le dernier message si plus récent
        if (new Date(msg.created_at) > new Date(conversation.lastMessage.created_at)) {
          conversation.lastMessage = msg;
          // Mettre à jour aussi les infos de la mcard du dernier message
          conversation.mcardId = msg.mcard_id;
          conversation.mcardName = msg.mcard_name;
        }
      });

      // Trier les messages dans chaque conversation par date croissante
      conversationsMap.forEach(conversation => {
        conversation.messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      });

      const conversationsList = Array.from(conversationsMap.values())
        .sort((a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime());

      setConversations(conversationsList);
    } catch (error: any) {
      console.error('Erreur lors du chargement:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les conversations"
      });
    } finally {
      setLoading(false);
    }
  };

  const markConversationAsRead = async (conversation: Conversation) => {
    if (!user) return;

    try {
      // Marquer tous les messages non lus de cet utilisateur comme lus
      await supabase
        .from('mcard_messages')
        .update({ is_read: true })
        .eq('sender_id', conversation.otherUserId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);
      
      loadConversations();
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('mcard_messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', user.id); // S'assurer que seul l'expéditeur peut supprimer

      if (error) throw error;

      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès"
      });

      loadConversations();
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le message"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
      
      // Configurer l'écoute en temps réel des nouveaux messages
      const channel = supabase
        .channel('messages-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'mcard_messages'
          },
          (payload) => {
            console.log('Message update:', payload);
            // Recharger seulement si l'utilisateur est concerné par ce message
            const newMessage = payload.new as any;
            if (newMessage && (newMessage.sender_id === user.id || newMessage.recipient_id === user.id)) {
              loadConversations();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    conversations,
    loading,
    loadConversations,
    markConversationAsRead,
    deleteMessage
  };
};