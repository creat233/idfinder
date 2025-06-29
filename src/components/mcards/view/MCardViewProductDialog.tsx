
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, ShoppingCart, X } from 'lucide-react';
import { MCardProduct } from '@/types/mcard';

interface MCardViewProductDialogProps {
  product: MCardProduct | null;
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
}

export const MCardViewProductDialog = ({ 
  product, 
  isOpen, 
  onClose, 
  phoneNumber 
}: MCardViewProductDialogProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg md:text-xl">Détails du Produit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 md:space-y-6">
          {/* Image en grand */}
          {product.image_url && (
            <div className="text-center">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-48 md:h-64 object-cover rounded-lg shadow-lg"
              />
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
                <p className="text-gray-600 text-sm md:text-base">{product.description}</p>
              </div>
            )}
          </div>

          {/* Boutons de contact */}
          {phoneNumber && (
            <div className="space-y-3">
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
      </DialogContent>
    </Dialog>
  );
};
