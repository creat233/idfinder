import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Conversation, ProcessedMessage } from "@/types/messages";
import { getAutoReplyMessage, sendAutoReply } from "@/services/autoReplyService";

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
        // Afficher le nom complet : Nom Prénom - Entreprise
        const displayName = msg.sender_id === user.id 
          ? msg.recipient_name
          : `${msg.sender_name} - ${msg.mcard_name}`;
        // Utiliser seulement l'userId pour regrouper, pas le mcard_id
        const key = otherUserId;
        
        if (!conversationsMap.has(key)) {
          conversationsMap.set(key, {
            otherUserId,
            otherUserName: displayName,
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
          // Mettre à jour le nom d'affichage aussi
          conversation.otherUserName = displayName;
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
      console.log('Marquage des messages comme lus:', {
        sender_id: conversation.otherUserId,
        recipient_id: user.id,
        mcard_id: conversation.mcardId
      });

      // Marquer tous les messages non lus de cette conversation comme lus
      const { error } = await supabase
        .from('mcard_messages')
        .update({ is_read: true })
        .eq('sender_id', conversation.otherUserId)
        .eq('recipient_id', user.id)
        .eq('mcard_id', conversation.mcardId)
        .eq('is_read', false);
      
      if (error) {
        console.error('Erreur RLS lors du marquage:', error);
        throw error;
      }

      console.log('Messages marqués comme lus avec succès');
      
      // Recharger les conversations pour mettre à jour le compteur
      await loadConversations();
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
          async (payload) => {
            console.log('Message update:', payload);
            const newMessage = payload.new as any;
            const oldMessage = payload.old as any;
            
            const isRelevant = newMessage && (newMessage.sender_id === user.id || newMessage.recipient_id === user.id);
            const wasRelevant = oldMessage && (oldMessage.sender_id === user.id || oldMessage.recipient_id === user.id);
            
            // Si c'est un nouveau message reçu, vérifier l'auto-réponse
            if (payload.eventType === 'INSERT' && newMessage && newMessage.recipient_id === user.id) {
              const autoReplyMessage = getAutoReplyMessage(user.id);
              if (autoReplyMessage && newMessage.subject !== '[Auto-réponse]') {
                await sendAutoReply(
                  user.id,
                  newMessage.sender_id,
                  newMessage.mcard_id,
                  autoReplyMessage
                );
              }
            }
            
            if (isRelevant || wasRelevant) {
              console.log('Rechargement des conversations après mise à jour');
              loadConversations();
            }
          }
        )
        .subscribe();

      // Écouter l'événement personnalisé de marquage des messages
      const handleMessagesMarkedAsRead = () => {
        console.log('Rechargement après marquage comme lu');
        loadConversations();
      };
      
      window.addEventListener('messagesMarkedAsRead', handleMessagesMarkedAsRead);

      return () => {
        supabase.removeChannel(channel);
        window.removeEventListener('messagesMarkedAsRead', handleMessagesMarkedAsRead);
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