import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trash2, MessageCircle, ShoppingCart, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MCardContactDialog } from '@/components/mcards/messaging/MCardContactDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<{
    mcardId: string;
    ownerName: string;
    ownerUserId: string;
    productName: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleContactOwner = (item: any) => {
    if (item.mcardOwnerUserId && item.mcardOwnerName) {
      const message = `Bonjour, je suis intéressé(e) par votre produit "${item.name}" que j'ai ajouté à mon panier. Pouvez-vous me donner plus d'informations ?`;
      navigate('/messages', { 
        state: { 
          prefilledMessage: message,
          recipientId: item.mcardOwnerUserId,
          mcardId: item.mcardId,
          mcardOwnerName: item.mcardOwnerName
        } 
      });
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageDialogOpen(true);
  };

  const handleOwnerClick = (mcardId: string) => {
    navigate(`/mcard/${mcardId}`);
  };

  const groupedItems = cartItems.reduce((acc, item) => {
    const key = `${item.mcardId}-${item.mcardOwnerName}`;
    if (!acc[key]) {
      acc[key] = {
        mcardId: item.mcardId,
        ownerName: item.mcardOwnerName || 'Propriétaire inconnu',
        ownerUserId: item.mcardOwnerUserId,
        products: []
      };
    }
    acc[key].products.push(item);
    return acc;
  }, {} as Record<string, { mcardId: string; ownerName: string; ownerUserId?: string; products: any[] }>);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mon Panier</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h3>
            <p className="text-gray-600 mb-6">Explorez les cartes vérifiées pour découvrir des produits et services intéressants</p>
            <Button 
              onClick={() => navigate('/mcards-verifiees')}
              className="bg-primary hover:bg-primary/90"
            >
              Découvrir les produits
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mon Panier</h1>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {cartItems.length} produit{cartItems.length > 1 ? 's' : ''}
            </Badge>
          </div>
          
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Vider le panier
          </Button>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedItems).map(([key, group]) => (
            <div key={key} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 
                  className="text-xl font-semibold text-gray-900 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleOwnerClick(group.mcardId)}
                >
                  {group.ownerName}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleOwnerClick(group.mcardId)}
                    className="text-primary border-primary hover:bg-primary/10"
                  >
                    Voir la carte
                  </Button>
                  {group.ownerUserId && (
                    <Button
                      onClick={() => handleContactOwner({
                        mcardId: group.mcardId,
                        mcardOwnerName: group.ownerName,
                        mcardOwnerUserId: group.ownerUserId,
                        name: group.products.map(p => p.name).join(', ')
                      })}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contacter
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid gap-4">
                {group.products.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 flex items-start gap-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick(item.image_url)}
                      />
                    )}
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-900">{item.name}</h4>
                      <Badge variant="secondary" className="text-sm mb-2">
                        {item.category}
                      </Badge>
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-green-600">
                          {item.price.toLocaleString()} {item.currency}
                        </span>
                        <span className="text-xs text-gray-500">
                          Ajouté le {format(item.addedAt, 'dd MMM yyyy à HH:mm', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactOwner({
                            mcardId: item.mcardId,
                            mcardOwnerName: item.mcardOwnerName,
                            mcardOwnerUserId: item.mcardOwnerUserId,
                            name: item.name
                          })}
                          className="text-primary border-primary hover:bg-primary/10"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Image Full Screen Dialog */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-gradient-to-br from-black/95 to-gray-900/95 border-none overflow-hidden">
            <div className="relative w-full h-full min-h-[80vh] flex items-center justify-center">
              {/* Elegant close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setImageDialogOpen(false)}
                className="absolute top-6 right-6 z-50 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </Button>
              
              {/* Beautiful image container */}
              <div className="relative p-8 w-full h-full flex items-center justify-center">
                <div className="relative max-w-full max-h-full">
                  <img
                    src={selectedImage}
                    alt="Image en plein écran"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent via-transparent to-white/5 pointer-events-none"></div>
                </div>
              </div>
              
              {/* Background pattern for elegance */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {selectedContact && (
          <MCardContactDialog
            isOpen={contactDialogOpen}
            onClose={() => {
              setContactDialogOpen(false);
              setSelectedContact(null);
            }}
            mcardId={selectedContact.mcardId}
            mcardOwnerName={selectedContact.ownerName}
            recipientId={selectedContact.ownerUserId}
            context={{
              type: 'product',
              title: selectedContact.productName
            }}
          />
        )}
      </div>
    </div>
  );
}