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
    <div className="flex-1 bg-gradient-to-b from-gray-50/50 to-white">
      <ScrollArea className="h-full w-full">
        <div className="p-4 md:p-6 max-h-full">
          {messages.length === 0 ? (
            <EmptyMessages />
          ) : (
            <div className="space-y-2 pb-6 min-h-full overflow-y-auto">
              {groupMessagesByDate(messages).map((group) => (
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
  );
}