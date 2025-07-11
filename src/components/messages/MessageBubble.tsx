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
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isCurrentUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {message.subject && (
          <p className={`font-medium text-sm mb-1 ${
            isCurrentUser ? 'text-blue-100' : 'text-gray-600'
          }`}>
            {message.subject}
          </p>
        )}
        <p className="text-sm">{message.message}</p>
        <p className={`text-xs mt-2 ${
          isCurrentUser ? 'text-blue-200' : 'text-gray-500'
        }`}>
          {new Date(message.created_at).toLocaleString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
}