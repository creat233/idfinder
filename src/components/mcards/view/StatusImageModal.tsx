import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusImageModalProps {
  imageUrl: string;
  statusText: string;
  children: React.ReactNode;
}

export const StatusImageModal = ({ imageUrl, statusText, children }: StatusImageModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
          
          {/* Image en plein écran avec overlay d'informations */}
          <div className="relative w-full h-[98vh] bg-black/95 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={statusText}
              className="w-full h-full object-contain"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            
            {/* Overlay avec titre */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
              <h3 className="font-bold text-lg text-white text-center">{statusText}</h3>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};