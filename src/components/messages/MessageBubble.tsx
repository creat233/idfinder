import { formatMessageTime } from "@/utils/dateUtils";

interface MessageBubbleProps {
  message: {
    id: string;
    subject?: string;
    message: string;
    created_at: string;
    sender_id: string;
  };
  isCurrentUser: boolean;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  return (
    <div className={`flex mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isCurrentUser ? 'ml-12' : 'mr-12'}`}>
        <div
          className={`px-4 py-3 rounded-[18px] shadow-sm ${
            isCurrentUser
              ? 'bg-blue-500 text-white rounded-br-[4px]'
              : 'bg-gray-100 text-gray-900 rounded-bl-[4px]'
          }`}
        >
          {message.subject && (
            <p className={`font-medium text-sm mb-2 ${
              isCurrentUser ? 'text-blue-100' : 'text-gray-600'
            }`}>
              {message.subject}
            </p>
          )}
          <p className="text-[15px] leading-[1.4] break-words whitespace-pre-wrap">{message.message}</p>
        </div>
        <div className={`flex mt-1 px-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}