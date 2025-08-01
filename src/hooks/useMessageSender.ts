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
    if (!replyText.trim() || !user || !selectedConversation) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('mcard_messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedConversation.otherUserId,
          mcard_id: selectedConversation.mcardId,
          subject: selectedConversation.messages.length === 0 ? 'Nouveau message' : `Re: ${selectedConversation.messages[0]?.subject || 'Message'}`,
          message: replyText
        });

      if (error) throw error;

      // Pas de notification - le message apparaît automatiquement
      onMessageSent();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le message"
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