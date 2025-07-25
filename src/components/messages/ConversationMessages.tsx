import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { DateSeparator } from "./DateSeparator";
import { EmptyMessages } from "./EmptyMessages";
import { groupMessagesByDate } from "@/utils/messageGrouping";
import { MCardMessage } from "@/types/mcard-verification";

interface ConversationMessagesProps {
  messages: MCardMessage[];
  currentUserId: string;
  onDeleteMessage?: (messageId: string) => Promise<boolean>;
}

export function ConversationMessages({
  messages,
  currentUserId,
  onDeleteMessage
}: ConversationMessagesProps) {
  return (
    <div className="flex-1 bg-gradient-to-b from-gray-50/50 to-white overflow-hidden relative">
      <ScrollArea className="h-full w-full">
        <div className="p-4 md:p-6 pb-24 space-y-2 min-h-full">
          {messages.length === 0 ? (
            <EmptyMessages />
          ) : (
            <div className="space-y-2 flex flex-col">
              {groupMessagesByDate(messages).map((group) => (
                <div key={group.date} className="space-y-2">
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
  );
}