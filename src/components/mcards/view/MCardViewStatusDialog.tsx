
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MessageCircle, Send, ExternalLink } from 'lucide-react';
import { MCardStatus } from '@/types/mcard';

interface MCardViewStatusDialogProps {
  status: MCardStatus | null;
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
}

export const MCardViewStatusDialog = ({ 
  status, 
  isOpen, 
  onClose, 
  phoneNumber 
}: MCardViewStatusDialogProps) => {
  if (!status) return null;

  const handleWhatsAppContact = () => {
    if (phoneNumber) {
      const message = encodeURIComponent(`Bonjour ! Je vous contacte concernant votre statut "${status.status_text}".`);
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleTelegramContact = () => {
    if (phoneNumber) {
      const message = encodeURIComponent(`Bonjour ! Je vous contacte concernant votre statut "${status.status_text}".`);
      const telegramUrl = `https://t.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`;
      window.open(telegramUrl, '_blank');
    }
  };

  const timeRemaining = status.expires_at ? 
    Math.max(0, Math.floor((new Date(status.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60))) : 
    null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Détails du Statut</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image en grand */}
          {status.status_image && (
            <div className="text-center">
              <img 
                src={status.status_image} 
                alt={status.status_text}
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
          
          {/* Statut */}
          <div className="text-center">
            <Badge 
              className="text-white font-medium px-4 py-2"
              style={{ backgroundColor: status.status_color }}
            >
              {status.status_text}
            </Badge>
          </div>

          {/* Temps restant */}
          {timeRemaining !== null && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {timeRemaining > 0 
                  ? `Expire dans ${timeRemaining}h`
                  : 'Expiré'
                }
              </span>
            </div>
          )}

          {/* Boutons de contact */}
          {phoneNumber && (
            <div className="space-y-2">
              <Button 
                onClick={handleWhatsAppContact}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contacter via WhatsApp
              </Button>
              
              <Button 
                onClick={handleTelegramContact}
                variant="outline"
                className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                <Send className="h-4 w-4 mr-2" />
                Contacter via Telegram
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
