import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface OnlineStatusIndicatorProps {
  userId: string;
  showText?: boolean;
  className?: string;
}

export const OnlineStatusIndicator = ({ 
  userId, 
  showText = true,
  className = "" 
}: OnlineStatusIndicatorProps) => {
  const isOnline = useOnlineStatus(userId);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}>
        {isOnline && (
          <span className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
        )}
      </div>
      {showText && (
        <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </span>
      )}
    </div>
  );
};
