import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

interface Conversation {
  otherUserId: string;
  otherUserName: string;
  mcardId: string;
  mcardName: string;
  messages: any[];
  lastMessage: any;
  unreadCount: number;
}

interface ConversationViewProps {
  conversation: Conversation | null;
  currentUserId: string;
  replyText: string;
  sending: boolean;
  onReplyChange: (text: string) => void;
  onSendMessage: () => void;
  onBack: () => void;
}

export function ConversationView({
  conversation,
  currentUserId,
  replyText,
  sending,
  onReplyChange,
  onSendMessage,
  onBack
}: ConversationViewProps) {
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
    <Card className="h-full">
      <div className="h-full flex flex-col">
        {/* En-tête de la conversation */}
        <div className="p-4 border-b bg-white shadow-sm">
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
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          {conversation.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">
                Aucun message dans cette conversation.<br />
                Commencez la discussion ci-dessous.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversation.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isCurrentUser={message.sender_id === currentUserId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Zone de saisie */}
        <MessageInput
          value={replyText}
          onChange={onReplyChange}
          onSend={onSendMessage}
          sending={sending}
        />
      </div>
    </Card>
  );
}