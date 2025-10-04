import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Conversation } from "@/types/messages";

export const useMessageSender = (user: any, onMessageSent: () => void) => {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (
    replyText: string, 
    selectedConversation: Conversation | null
  ) => {
    if (!replyText.trim() || !user || !selectedConversation) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Message vide ou conversation non sélectionnée"
      });
      return;
    }

    setSending(true);
    try {
      console.log('Envoi de message:', {
        sender_id: user.id,
        recipient_id: selectedConversation.otherUserId,
        mcard_id: selectedConversation.mcardId
      });

      const { data, error } = await supabase
        .from('mcard_messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedConversation.otherUserId,
          mcard_id: selectedConversation.mcardId,
          subject: selectedConversation.messages.length === 0 ? 'Nouveau message' : `Re: ${selectedConversation.messages[0]?.subject || 'Message'}`,
          message: replyText
        })
        .select();

      if (error) {
        console.error('Erreur envoi message:', error);
        
        let errorMessage = "Impossible d'envoyer le message";
        if (error.code === '42501' || error.message.includes('policy')) {
          errorMessage = "Vous n'avez pas la permission d'envoyer ce message. Vous êtes peut-être bloqué.";
        } else if (error.code === '23503') {
          errorMessage = "Destinataire invalide.";
        }
        
        throw new Error(errorMessage);
      }

      console.log('Message envoyé avec succès:', data);
      
      toast({
        title: "✅ Message envoyé",
        description: "Votre message a été envoyé avec succès"
      });

      onMessageSent();
    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le message"
      });
    } finally {
      setSending(false);
    }
  };

  return {
    sending,
    sendMessage
  };
};