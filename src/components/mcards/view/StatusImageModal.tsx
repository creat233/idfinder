import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MCardStatus } from '@/types/mcard';

interface StatusImageModalProps {
  imageUrl: string;
  statusText: string;
  children: React.ReactNode;
  allStatuses?: MCardStatus[];
  currentStatusId?: string;
  onNavigate?: (statusId: string) => void;
}

export const StatusImageModal = ({ 
  imageUrl, 
  statusText, 
  children, 
  allStatuses = [],
  currentStatusId,
  onNavigate
}: StatusImageModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Trouver l'index du statut actuel
  useEffect(() => {
    if (allStatuses.length > 0 && currentStatusId) {
      const index = allStatuses.findIndex(s => s.id === currentStatusId);
      if (index !== -1) setCurrentIndex(index);
    }
  }, [allStatuses, currentStatusId]);

  const hasMultipleStatuses = allStatuses.length > 1;
  const currentStatus = allStatuses[currentIndex] || { status_image: imageUrl, status_text: statusText };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      if (onNavigate && allStatuses[newIndex]) {
        onNavigate(allStatuses[newIndex].id);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < allStatuses.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      if (onNavigate && allStatuses[newIndex]) {
        onNavigate(allStatuses[newIndex].id);
      }
    }
  };

  // Gestion du swipe tactile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!hasMultipleStatuses) return;

    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe vers la gauche - statut suivant
        handleNext();
      } else {
        // Swipe vers la droite - statut précédent
        handlePrevious();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          {children}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg flex items-center justify-center">
            <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[98vw] max-h-[98vh] w-full p-0 bg-transparent border-0">
        <div className="relative w-full h-full">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50 bg-black/70 hover:bg-black/90 text-white rounded-full shadow-lg"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
          
          {/* Boutons de navigation */}
          {hasMultipleStatuses && (
            <>
              {currentIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-black/70 hover:bg-black/90 text-white rounded-full shadow-lg w-12 h-12"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
              )}
              
              {currentIndex < allStatuses.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-black/70 hover:bg-black/90 text-white rounded-full shadow-lg w-12 h-12"
                  onClick={handleNext}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              )}
            </>
          )}
          
          {/* Image en plein écran avec overlay d'informations */}
          <div 
            className="relative w-full h-[98vh] bg-black/95 rounded-lg overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={currentStatus.status_image || imageUrl}
              alt={currentStatus.status_text || statusText}
              className="w-full h-full object-contain transition-opacity duration-300"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            
            {/* Indicateurs de progression */}
            {hasMultipleStatuses && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
                {allStatuses.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-white w-8' 
                        : 'bg-white/40 w-4'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Overlay avec titre */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
              <h3 className="font-bold text-xl text-white text-center">
                {currentStatus.status_text || statusText}
              </h3>
              {hasMultipleStatuses && (
                <p className="text-white/70 text-sm text-center mt-2">
                  {currentIndex + 1} / {allStatuses.length}
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};