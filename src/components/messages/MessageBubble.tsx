import { formatMessageTime } from "@/utils/dateUtils";
import { Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { MessageTranslateButton } from "./MessageTranslateButton";

interface MessageBubbleProps {
  message: {
    id: string;
    subject?: string;
    message: string;
    created_at: string;
    sender_id: string;
    is_read?: boolean;
  };
  isCurrentUser: boolean;
  onDelete?: (messageId: string) => Promise<boolean>;
}

const MAX_SWIPE = 80;

export function MessageBubble({ message, isCurrentUser, onDelete }: MessageBubbleProps) {
  const [offset, setOffset] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const startX = useRef<number | null>(null);
  const currentOffset = useRef(0);

  const canSwipe = isCurrentUser && !!onDelete;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canSwipe) return;
    startX.current = e.touches[0].clientX;
    currentOffset.current = offset;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canSwipe || startX.current === null) return;
    const delta = e.touches[0].clientX - startX.current;
    // Swipe right to reveal delete (positive delta for current user on right side)
    // Actually for right-aligned bubbles, swipe LEFT to reveal delete on right
    const next = Math.max(-MAX_SWIPE, Math.min(0, currentOffset.current + delta));
    setOffset(next);
  };

  const handleTouchEnd = () => {
    if (!canSwipe) return;
    startX.current = null;
    setOffset(offset < -MAX_SWIPE / 2 ? -MAX_SWIPE : 0);
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(message.id);
    } finally {
      setIsDeleting(false);
      setOffset(0);
    }
  };

  return (
    <div className={`flex mb-3 relative ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {canSwipe && offset < 0 && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute right-0 top-0 bottom-6 flex items-center justify-center bg-red-500 text-white rounded-lg px-4 z-0"
          style={{ width: MAX_SWIPE }}
          aria-label="Supprimer le message"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      )}
      <div
        className={`max-w-[70%] ${isCurrentUser ? 'ml-12' : 'mr-12'} transition-transform relative z-10`}
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
        <MessageTranslateButton text={message.message} isCurrentUser={isCurrentUser} />
        <div className={`flex mt-1 px-2 items-center ${isCurrentUser ? 'justify-end' : 'justify-start'} gap-2`}>
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.created_at)}
          </span>
          {isCurrentUser && (
            <span className="text-xs text-gray-400">
              {message.is_read ? '✓✓ Lu' : '✓ Envoyé'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
