
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, MessageCircle, Menu, UserX, UserCheck } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { DateSeparator } from "./DateSeparator";
import { Conversation } from "@/types/messages";
import { groupMessagesByDate } from "@/utils/messageGrouping";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  onUnblockUser
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

  if (!conversation) {
    return (
      <Card className="h-full">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
            <p className="text-sm">Choisissez une conversation dans la liste pour commencer à discuter</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* En-tête de la conversation */}
      <div className="flex-shrink-0 p-4 border-b bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="lg:hidden hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {conversation.otherUserName.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-[17px]">{conversation.otherUserName}</h2>
                <p className="text-sm text-gray-500">MCard: {conversation.mcardName}</p>
              </div>
            </div>
            
            {/* Menu de blocage/déblocage dans l'en-tête */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  disabled={isBlocking}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isUserBlocked ? (
                  <DropdownMenuItem
                    onClick={handleUnblockUser}
                    disabled={isBlocking}
                    className="text-green-600 focus:text-green-600"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Débloquer l'utilisateur
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={handleBlockUser}
                    disabled={isBlocking}
                    className="text-red-600 focus:text-red-600"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Bloquer l'utilisateur
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      </div>

      {/* Messages - Zone scrollable */}
      <div className="flex-1 bg-gray-50/30">
        <ScrollArea className="h-full">
          <div className="p-6">
            {conversation.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <p className="text-gray-500 text-center">
                  Aucun message dans cette conversation.<br />
                  Commencez la discussion ci-dessous.
                </p>
              </div>
            ) : (
              <div className="space-y-1 pb-4">
                {groupMessagesByDate(conversation.messages).map((group) => (
                  <div key={group.date}>
                    <DateSeparator date={group.date} />
                    {group.messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isCurrentUser={message.sender_id === currentUserId}
                        onDelete={onDeleteMessage}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Zone de saisie - FIXE EN BAS */}
      <div className="flex-shrink-0 border-t bg-white sticky bottom-0 z-10">
        <MessageInput
          value={replyText}
          onChange={onReplyChange}
          onSend={onSendMessage}
          sending={sending}
        />
      </div>
    </div>
  );
}
