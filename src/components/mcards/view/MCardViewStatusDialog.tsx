
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Clock, MessageCircle, Send, X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { MCardStatus } from '@/types/mcard';
import { useState, useEffect } from 'react';

interface MCardViewStatusDialogProps {
  status: MCardStatus | null;
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
  allStatuses?: MCardStatus[];
  currentIndex?: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export const MCardViewStatusDialog = ({ 
  status, 
  isOpen, 
  onClose, 
  phoneNumber,
  allStatuses = [],
  currentIndex = 0,
  onNavigate
}: MCardViewStatusDialogProps) => {
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessageField, setShowMessageField] = useState(false);

  if (!status) return null;

  // Gestion des touches clavier pour navigation
  useEffect(() => {
    if (!isOpen || !onNavigate) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        onNavigate('next');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onNavigate]);

  const handleWhatsAppContact = () => {
    if (phoneNumber) {
      const finalMessage = message || `Bonjour ! Je vous contacte concernant votre statut "${status.status_text}".`;
      const whatsappMessage = encodeURIComponent(finalMessage);
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleTelegramContact = () => {
    if (phoneNumber) {
      const finalMessage = message || `Bonjour ! Je vous contacte concernant votre statut "${status.status_text}".`;
      const telegramMessage = encodeURIComponent(finalMessage);
      const telegramUrl = `https://t.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${telegramMessage}`;
      window.open(telegramUrl, '_blank');
    }
  };

  const timeRemaining = status.expires_at ? 
    Math.max(0, Math.floor((new Date(status.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60))) : 
    null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              {onNavigate && allStatuses.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('prev')}
                  className="hover:bg-gray-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <DialogTitle className="text-center text-lg md:text-xl flex-1">
                Détails du Statut {onNavigate && allStatuses.length > 1 && `(${currentIndex + 1}/${allStatuses.length})`}
              </DialogTitle>
              {onNavigate && allStatuses.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('next')}
                  className="hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-6">
            {/* Image optimisée */}
            {status.status_image && (
              <div className="text-center relative">
                <img 
                  src={status.status_image} 
                  alt={status.status_text}
                  className="w-full max-h-96 object-contain rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setIsImageFullscreen(true)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => setIsImageFullscreen(true)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Statut */}
            <div className="text-center">
              <Badge 
                className="text-white font-medium px-6 py-3 text-base"
                style={{ backgroundColor: status.status_color }}
              >
                {status.status_text}
              </Badge>
            </div>

            {/* Temps restant */}
            {timeRemaining !== null && (
              <div className="flex items-center justify-center gap-2 text-sm md:text-base text-gray-600">
                <Clock className="h-5 w-5" />
                <span>
                  {timeRemaining > 0 
                    ? `Expire dans ${timeRemaining}h`
                    : 'Expiré'
                  }
                </span>
              </div>
            )}

            {/* Champ de message personnalisé - Toujours visible */}
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => setShowMessageField(!showMessageField)}
                className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {showMessageField ? 'Masquer le message' : 'Personnaliser le message'}
              </Button>
              
              {showMessageField && (
                <div className="space-y-2">
                  <Textarea
                    placeholder={`Bonjour ! Je vous contacte concernant votre statut "${status.status_text}".`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              )}
              
              {phoneNumber ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    onClick={handleWhatsAppContact}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp
                  </Button>
                  
                  <Button 
                    onClick={handleTelegramContact}
                    variant="outline"
                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 py-3 text-base"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Telegram
                  </Button>
                </div>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Aucun numéro de téléphone disponible pour contacter cette personne.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal plein écran pour l'image */}
      {isImageFullscreen && status.status_image && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white border-white/40"
              onClick={() => setIsImageFullscreen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <img 
              src={status.status_image} 
              alt={status.status_text}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};
