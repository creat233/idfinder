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
    <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl p-6 border border-white/60 backdrop-blur-sm overflow-hidden">
      {/* Navigation arrows */}
      {hasMultipleStatuses && (
        <>
          <Button
            size="icon"
            variant="ghost"
            onClick={prevStatus}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/90 hover:bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-white/50"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={nextStatus}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/90 hover:bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-white/50"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </Button>
        </>
      )}

      {/* Status indicators */}
      {hasMultipleStatuses && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-white/80 rounded-full px-3 py-1 shadow-sm">
          {statuses.map((_, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 w-8 shadow-sm' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 pt-8">
        {/* Status image */}
        {currentStatus.status_image && (
          <StatusImageModal 
            imageUrl={currentStatus.status_image}
            statusText={currentStatus.status_text}
          >
            <div className="relative group flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <img 
                  src={currentStatus.status_image} 
                  alt={currentStatus.status_text}
                  className="w-full lg:w-48 h-64 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    console.error('Error loading status image:', currentStatus.status_image);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <span className="text-white text-sm font-medium">Cliquer pour agrandir</span>
                  </div>
                </div>
              </div>
            </div>
          </StatusImageModal>
        )}
        
        {/* Status content */}
        <div className="flex-1 space-y-6">
          {/* Badge with status text */}
          <div className="flex items-center justify-center lg:justify-start">
            <Badge 
              className="text-white font-bold cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg text-lg px-6 py-3 rounded-full border-2 border-white/30"
              style={{ 
                backgroundColor: currentStatus.status_color,
                background: `linear-gradient(135deg, ${currentStatus.status_color}, ${currentStatus.status_color}dd)`
              }}
              onClick={() => onStatusClick(currentStatus)}
            >
              <Sparkles className="w-5 h-5 mr-3 animate-pulse" />
              {currentStatus.status_text}
            </Badge>
          </div>
          
          {/* Time remaining */}
          {timeRemaining !== null && (
            <div className="flex items-center justify-center lg:justify-start gap-3 text-sm text-gray-600 bg-white/80 rounded-xl px-4 py-3 w-fit mx-auto lg:mx-0 shadow-sm">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">
                {timeRemaining > 0 
                  ? `Expire dans ${timeRemaining}h`
                  : 'Expiré'
                }
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
            <Button
              size="lg"
              variant="outline"
              onClick={() => onShareStatus(currentStatus)}
              className="bg-white/90 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:scale-105 transition-all duration-300 shadow-lg rounded-xl px-6 py-3 font-semibold"
            >
              <Share2 className="h-5 w-5 mr-3" />
              Partager
            </Button>
            
            {!isOwner && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => onContactOwner(currentStatus)}
                className="bg-white/90 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 hover:scale-105 transition-all duration-300 shadow-lg rounded-xl px-6 py-3 font-semibold"
              >
                <Send className="h-5 w-5 mr-3" />
                Contacter
              </Button>
            )}

            {isOwner && (
              <Button 
                size="lg" 
                variant="ghost" 
                onClick={() => onEditStatus(currentStatus)}
                className="bg-white/80 hover:bg-white/90 hover:scale-105 transition-all duration-300 rounded-xl px-6 py-3 font-semibold shadow-lg"
              >
                <Edit className="h-5 w-5 mr-3" />
                Modifier
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Counter */}
      {hasMultipleStatuses && (
        <div className="absolute bottom-4 right-4 bg-white/90 text-gray-700 text-sm px-4 py-2 rounded-full font-semibold shadow-lg border border-white/50">
          {currentIndex + 1} / {statuses.length}
        </div>
      )}
    </div>
  );
};