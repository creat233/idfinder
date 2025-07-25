import { useEffect, useRef } from "react";
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll vers le bas quand les messages changent
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="flex-1 bg-gradient-to-b from-gray-50/50 to-white overflow-hidden relative">
      <ScrollArea ref={scrollAreaRef} className="h-full w-full">
        <div className="p-4 md:p-6 space-y-2 min-h-full flex flex-col justify-end"
             style={{ 
               paddingBottom: '140px',
               minHeight: 'calc(100vh - 180px)'
             }}>
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