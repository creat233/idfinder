import { formatMessageTime } from "@/utils/dateUtils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MessageBubbleProps {
  message: {
    id: string;
    subject?: string;
    message: string;
    created_at: string;
    sender_id: string;
  };
  isCurrentUser: boolean;
  onDelete?: (messageId: string) => Promise<boolean>;
}

export function MessageBubble({ message, isCurrentUser, onDelete }: MessageBubbleProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete || !window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(message.id);
    } finally {
      setIsDeleting(false);
    }
  };

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
        <div className={`flex mt-1 px-2 items-center justify-between ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.created_at)}
          </span>
          {isCurrentUser && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 ml-2"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}