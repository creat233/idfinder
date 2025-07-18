
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, Maximize2 } from 'lucide-react';
import { MCardProduct } from '@/types/mcard';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MCardViewProductDialogProps {
  product: MCardProduct | null;
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
  mcardId?: string;
  mcardOwnerName?: string;
  mcardOwnerUserId?: string;
}

export const MCardViewProductDialog = ({ 
  product, 
  isOpen, 
  onClose, 
  phoneNumber,
  mcardId,
  mcardOwnerName,
  mcardOwnerUserId
}: MCardViewProductDialogProps) => {
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const navigate = useNavigate();

  if (!product) return null;

  const handleWhatsAppContact = () => {
    if (phoneNumber) {
      const message = encodeURIComponent(`Bonjour ! Je suis intéressé par votre produit "${product.name}" au prix de ${product.price} ${product.currency}.`);
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleTelegramContact = () => {
    if (phoneNumber) {
      const message = encodeURIComponent(`Bonjour ! Je suis intéressé par votre produit "${product.name}" au prix de ${product.price} ${product.currency}.`);
      const telegramUrl = `https://t.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`;
      window.open(telegramUrl, '_blank');
    }
  };

  const handleContactMessage = () => {
    if (mcardId && mcardOwnerUserId) {
      // Stocker les données du produit pour le message pré-rempli
      const productContext = {
        type: 'product' as const,
        title: product.name,
        mcardId,
        mcardOwnerName: mcardOwnerName || 'Propriétaire',
        recipientId: mcardOwnerUserId
      };
      
      // Stocker dans localStorage pour que la page Messages puisse récupérer
      localStorage.setItem('pendingMessage', JSON.stringify(productContext));
      
      // Rediriger vers la page des messages
      navigate('/messages');
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg md:text-xl">Détails du Produit</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-6">
            {/* Image optimisée */}
            {product.image_url && (
              <div className="text-center relative">
                <img 
                  src={product.image_url} 
                  alt={product.name}
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
            
            {/* Informations du produit */}
            <div className="space-y-3 md:space-y-4">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{product.name}</h3>
                <Badge variant="secondary" className="mt-2">
                  {product.category}
                </Badge>
              </div>
              
              <div className="text-center">
                <span className="text-2xl md:text-3xl font-bold text-green-600">
                  {product.price.toLocaleString()} {product.currency}
                </span>
              </div>

              {product.description && (
                <div className="text-center">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>

            {/* Boutons de contact */}
            <div className="space-y-3">
              {/* Bouton Contacter via Messages */}
              {mcardId && mcardOwnerUserId && (
                <Button 
                  onClick={handleContactMessage}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contacter le vendeur
                </Button>
              )}
              
              {/* Boutons WhatsApp et Telegram si numéro disponible */}
              {phoneNumber && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    onClick={handleWhatsAppContact}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Commander via WhatsApp
                  </Button>
                  
                  <Button 
                    onClick={handleTelegramContact}
                    variant="outline"
                    className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 py-3 text-base"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Commander via Telegram
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal plein écran pour l'image */}
      {isImageFullscreen && product.image_url && (
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
              src={product.image_url} 
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};
