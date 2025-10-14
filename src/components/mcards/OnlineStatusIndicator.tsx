import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Circle } from 'lucide-react';

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
      <div className="relative">
        <Circle 
          className={`h-3 w-3 ${isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`}
        />
        {isOnline && (
          <Circle 
            className="absolute inset-0 h-3 w-3 fill-green-500 text-green-500 animate-ping opacity-75" 
          />
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
