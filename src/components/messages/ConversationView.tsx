
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EmptyConversation } from "./EmptyConversation";
import { ConversationHeader } from "./ConversationHeader";
import { ConversationMessages } from "./ConversationMessages";
import { MessageInput } from "./MessageInput";
import { Conversation } from "@/types/messages";

interface ConversationViewProps {
  conversation: Conversation | null;
  currentUserId: string;
  replyText: string;
  sending: boolean;
  onReplyChange: (text: string) => void;
  onSendMessage: () => void;
  onBack: () => void;
  onDeleteMessage?: (messageId: string) => Promise<boolean>;
  onBlockUser?: (userId: string) => Promise<void>;
  onUnblockUser?: (userId: string) => Promise<void>;
  onDeleteConversation?: () => Promise<void>;
}

export function ConversationView({
  conversation,
  currentUserId,
  replyText,
  sending,
  onReplyChange,
  onSendMessage,
  onBack,
  onDeleteMessage,
  onBlockUser,
  onUnblockUser,
  onDeleteConversation
}: ConversationViewProps) {
  const [isBlocking, setIsBlocking] = useState(false);
  const [isUserBlocked, setIsUserBlocked] = useState(false);

  // Vérifier si l'utilisateur est bloqué
  useEffect(() => {
    const checkBlockStatus = async () => {
      if (!conversation || !currentUserId) return;

      try {
        const { data, error } = await supabase
          .from('mcard_blocked_users')
          .select('id')
          .eq('mcard_id', conversation.mcardId)
          .eq('blocked_user_id', conversation.otherUserId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Erreur lors de la vérification du blocage:', error);
          return;
        }

        setIsUserBlocked(!!data);
      } catch (error) {
        console.error('Erreur lors de la vérification du blocage:', error);
      }
    };

    checkBlockStatus();
  }, [conversation, currentUserId]);

  const handleBlockUser = async () => {
    if (!onBlockUser || !conversation || !window.confirm("Êtes-vous sûr de vouloir bloquer cet utilisateur ?")) {
      return;
    }

    setIsBlocking(true);
    try {
      await onBlockUser(conversation.otherUserId);
      setIsUserBlocked(true);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblockUser = async () => {
    if (!onUnblockUser || !conversation || !window.confirm("Êtes-vous sûr de vouloir débloquer cet utilisateur ?")) {
      return;
    }

    setIsBlocking(true);
    try {
      await onUnblockUser(conversation.otherUserId);
      setIsUserBlocked(false);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!onDeleteConversation || !conversation || !window.confirm("Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action est irréversible.")) {
      return;
    }

    try {
      await onDeleteConversation();
    } catch (error) {
      console.error('Erreur lors de la suppression de la conversation:', error);
    }
  };

  if (!conversation) {
    return <EmptyConversation />;
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <ConversationHeader
        otherUserName={conversation.otherUserName}
        mcardName={conversation.mcardName}
        mcardSlug={conversation.mcardSlug}
        isUserBlocked={isUserBlocked}
        isBlocking={isBlocking}
        onBack={onBack}
        onBlockUser={handleBlockUser}
        onUnblockUser={handleUnblockUser}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <ConversationMessages
            messages={conversation.messages}
            currentUserId={currentUserId}
            onDeleteMessage={onDeleteMessage}
          />
        </div>
        
        <div className="border-t bg-white flex-shrink-0">
          <MessageInput
            value={replyText}
            onChange={onReplyChange}
            onSend={onSendMessage}
            sending={sending}
          />
        </div>
      </div>
    </div>
  );
};
