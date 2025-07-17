import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Edit, Share2, Send, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { MCardStatus } from '@/types/mcard';
import { StatusImageModal } from './StatusImageModal';
import { useToast } from '@/hooks/use-toast';

interface MCardStatusCarouselProps {
  statuses: MCardStatus[];
  isOwner?: boolean;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onStatusClick: (status: MCardStatus) => void;
  onEditStatus: (status: MCardStatus) => void;
  onShareStatus: (status: MCardStatus) => void;
  onContactOwner: (status: MCardStatus) => void;
}

export const MCardStatusCarousel = ({
  statuses,
  isOwner,
  currentIndex,
  onIndexChange,
  onStatusClick,
  onEditStatus,
  onShareStatus,
  onContactOwner
}: MCardStatusCarouselProps) => {
  const { toast } = useToast();

  if (statuses.length === 0) return null;

  const currentStatus = statuses[currentIndex];
  const hasMultipleStatuses = statuses.length > 1;

  const nextStatus = () => {
    onIndexChange((currentIndex + 1) % statuses.length);
  };

  const prevStatus = () => {
    onIndexChange(currentIndex === 0 ? statuses.length - 1 : currentIndex - 1);
  };

  const timeRemaining = currentStatus.expires_at ? 
    Math.max(0, Math.floor((new Date(currentStatus.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60))) : 
    null;

  return (
    <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl p-6 border border-white/60 backdrop-blur-sm">
      {/* Navigation arrows */}
      {hasMultipleStatuses && (
        <>
          <Button
            size="icon"
            variant="ghost"
            onClick={prevStatus}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={nextStatus}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </Button>
        </>
      )}

      {/* Status indicators */}
      {hasMultipleStatuses && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {statuses.map((_, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-600 w-6' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6 pt-8">
        {/* Status image */}
        {currentStatus.status_image && (
          <StatusImageModal 
            imageUrl={currentStatus.status_image}
            statusText={currentStatus.status_text}
          >
            <div className="relative group flex-shrink-0">
              <img 
                src={currentStatus.status_image} 
                alt={currentStatus.status_text}
                className="w-full sm:w-32 md:w-40 h-48 sm:h-32 md:h-40 object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105"
                onError={(e) => {
                  console.error('Error loading status image:', currentStatus.status_image);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                Cliquer pour agrandir
              </div>
            </div>
          </StatusImageModal>
        )}
        
        {/* Status content */}
        <div className="flex-1 space-y-4">
          {/* Badge with status text */}
          <div className="flex items-center justify-between">
            <Badge 
              className="text-white font-semibold cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg text-base px-4 py-2"
              style={{ backgroundColor: currentStatus.status_color }}
              onClick={() => onStatusClick(currentStatus)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {currentStatus.status_text}
            </Badge>
          </div>
          
          {/* Time remaining */}
          {timeRemaining !== null && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2 w-fit">
              <Clock className="h-4 w-4" />
              <span className="font-medium">
                {timeRemaining > 0 
                  ? `Expire dans ${timeRemaining}h`
                  : 'Expiré'
                }
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onShareStatus(currentStatus)}
              className="bg-white/80 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:scale-105 transition-all duration-300 shadow-sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
            
            {!isOwner && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onContactOwner(currentStatus)}
                className="bg-white/80 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 hover:scale-105 transition-all duration-300 shadow-sm"
              >
                <Send className="h-4 w-4 mr-2" />
                Contacter
              </Button>
            )}

            {isOwner && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onEditStatus(currentStatus)}
                className="bg-white/60 hover:bg-white/80 hover:scale-105 transition-all duration-300"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Counter */}
      {hasMultipleStatuses && (
        <div className="absolute bottom-4 right-4 bg-white/80 text-gray-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
          {currentIndex + 1} / {statuses.length}
        </div>
      )}
    </div>
  );
};