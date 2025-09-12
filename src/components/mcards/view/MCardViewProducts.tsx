
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, ShoppingCart, Share2, MessageCircle, Star, Send, ShoppingBag } from 'lucide-react';
import { PinProductButton } from '@/components/mcards/PinProductButton';
import { MCardProduct } from '@/types/mcard';
import { MCardViewProductDialog } from './MCardViewProductDialog';
import { MCardViewAddProductDialog } from './MCardViewAddProductDialog';
import { MCardViewEditProductDialog } from './MCardViewEditProductDialog';
import { MCardContactDialog } from '../messaging/MCardContactDialog';
import { ProductImageModal } from './ProductImageModal';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { usePlanLimits } from '@/hooks/usePlanLimits';

interface MCardViewProductsProps {
  products: MCardProduct[];
  phoneNumber?: string;
  isOwner?: boolean;
  mcardId: string;
  mcardPlan?: string;
  mcardOwnerName?: string;
  mcardOwnerUserId?: string;
  onProductsChange?: () => void;
  onOptimisticProductAdd?: (product: any) => void;
}

export const MCardViewProducts = ({ 
  products, 
  phoneNumber, 
  isOwner, 
  mcardId, 
  mcardPlan,
  mcardOwnerName,
  mcardOwnerUserId,
  onProductsChange,
  onOptimisticProductAdd 
}: MCardViewProductsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<MCardProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MCardProduct | null>(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactContext, setContactContext] = useState<{ type: 'status' | 'product'; title: string } | undefined>();
  const { toast } = useToast();
  const { addToCart, isInCart } = useCart();

  const activeProducts = products.filter(product => product.is_active);
  
  // Utilisation correcte du hook usePlanLimits
  const { checkProductLimit } = usePlanLimits({ 
    plan: mcardPlan || 'free', 
    statusesCreatedToday: 0, 
    currentProductsCount: products.length 
  });
  
  const isPremiumOrUltimate = mcardPlan === 'premium' || mcardPlan === 'ultimate';
  const canAddProduct = isOwner && isPremiumOrUltimate;

  const handleProductClick = (product: MCardProduct) => {
    const index = activeProducts.findIndex(p => p.id === product.id);
    setCurrentProductIndex(index);
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleNavigateProduct = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = currentProductIndex > 0 ? currentProductIndex - 1 : activeProducts.length - 1;
      setCurrentProductIndex(newIndex);
      setSelectedProduct(activeProducts[newIndex]);
    } else {
      const newIndex = currentProductIndex < activeProducts.length - 1 ? currentProductIndex + 1 : 0;
      setCurrentProductIndex(newIndex);
      setSelectedProduct(activeProducts[newIndex]);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = () => {
    // Vérifier les limites avant d'ouvrir le dialog
    if (checkProductLimit()) {
      setIsAddDialogOpen(true);
    }
  };

  const handleProductAdded = () => {
    onProductsChange?.();
  };

  const handleEditProduct = (product: MCardProduct) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleProductUpdated = () => {
    onProductsChange?.();
    setEditingProduct(null);
  };

  const handleShareProduct = (product: MCardProduct) => {
    const shareText = `Produit: ${product.name} - ${product.price.toLocaleString()} ${product.currency} - ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Produit partagé',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Produit copié !",
        description: "Le produit a été copié dans le presse-papiers"
      });
    }
  };

  const handleWhatsAppShare = (product: MCardProduct) => {
    const message = encodeURIComponent(`Produit: ${product.name} - ${product.price.toLocaleString()} ${product.currency} - ${window.location.href}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = (product: MCardProduct) => {
    addToCart(product, {
      mcardId,
      ownerName: mcardOwnerName,
      ownerUserId: mcardOwnerUserId
    });
    toast({
      title: "Produit ajouté au panier !",
      description: `${product.name} a été ajouté à votre panier`
    });
  };

  const getActionButtonText = (category: string) => {
    switch (category.toLowerCase()) {
      case 'service':
        return 'Contacte';
      case 'produit':
        return 'Achète';
      case 'menu restaurant':
        return 'Commende';
      case 'consultation':
        return 'Rendez-Vous';
      case 'formation':
        return 'S\'inscrire';
      case 'événement':
        return 'Réserve';
      case 'article':
        return 'Lire';
      case 'autre':
        return 'Contacte';
      default:
        return 'Contacte';
    }
  };

  if (activeProducts.length === 0 && !canAddProduct) return null;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mx-2 sm:mx-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            🛍️ Produits & Services
          </h3>
          {canAddProduct && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleAddProduct}
              className="text-blue-600 border-blue-600 hover:bg-blue-50 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter un produit
            </Button>
          )}
        </div>

        {activeProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {canAddProduct ? (
              <div>
                <p className="mb-4">Aucun produit ou service disponible</p>
                <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter votre premier produit
                </Button>
              </div>
            ) : (
              <p>Aucun produit ou service disponible</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {activeProducts.map((product) => (
              <div 
                key={product.id} 
                className="border rounded-xl p-3 sm:p-4 md:p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                {product.image_url && (
                  <ProductImageModal
                    imageUrl={product.image_url}
                    product={product}
                  >
                    <div className="relative group mb-3 sm:mb-4">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                        onError={(e) => {
                          console.error('Error loading product image:', product.image_url);
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Product image loaded successfully:', product.image_url);
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        Cliquer pour agrandir
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </ProductImageModal>
                )}
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg sm:text-xl text-gray-900 cursor-pointer hover:text-blue-600 transition-colors mb-2" onClick={() => handleProductClick(product)}>
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-sm font-medium">
                          <Star className="w-3 h-3 mr-1" />
                          {product.category}
                        </Badge>
                      </div>
                     </div>
                     {isOwner && (
                       <div className="flex gap-2 items-start">
                         <PinProductButton
                           productId={product.id}
                           isPinned={product.is_pinned || false}
                           onPinToggle={() => onProductsChange?.()}
                         />
                         <Button 
                           size="sm" 
                           variant="ghost" 
                           onClick={(e) => {
                             e.stopPropagation();
                             handleEditProduct(product);
                           }}
                           className="hover:bg-gray-100 hover:scale-105 transition-all"
                         >
                           <Edit className="h-4 w-4" />
                         </Button>
                       </div>
                     )}
                  </div>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                      {product.price.toLocaleString()} {product.currency}
                    </span>
                    <ShoppingCart className="h-6 w-6 text-green-500" />
                  </div>

                  {/* Boutons d'action améliorés */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShareProduct(product)}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:scale-105 transition-all flex-1 shadow-sm"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </Button>
                    
                    {!isOwner && (
                      <>
                        <Button
                          size="sm"
                          variant={isInCart(product.id) ? "default" : "outline"}
                          onClick={() => handleAddToCart(product)}
                          disabled={isInCart(product.id)}
                          className={`${
                            isInCart(product.id)
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "text-green-600 border-green-600 hover:bg-green-50"
                          } hover:scale-105 transition-all flex-1 shadow-sm`}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          {isInCart(product.id) ? "Dans le panier" : "Ajouter au panier"}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setContactContext({
                              type: 'product',
                              title: product.name
                            });
                            setIsContactDialogOpen(true);
                          }}
                          className="text-purple-600 border-purple-600 hover:bg-purple-50 hover:scale-105 transition-all flex-1 shadow-sm"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {getActionButtonText(product.category)}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MCardViewProductDialog
        product={selectedProduct}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        phoneNumber={phoneNumber}
        mcardId={mcardId}
        mcardOwnerName={mcardOwnerName}
        mcardOwnerUserId={mcardOwnerUserId}
        allProducts={activeProducts}
        currentIndex={currentProductIndex}
        onNavigate={handleNavigateProduct}
      />

      {canAddProduct && (
        <MCardViewAddProductDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          mcardId={mcardId}
          onProductAdded={handleProductAdded}
          onOptimisticProductAdd={onOptimisticProductAdd}
        />
      )}

      {isOwner && (
        <MCardViewEditProductDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          product={editingProduct}
          onProductUpdated={handleProductUpdated}
        />
      )}

      {!isOwner && mcardOwnerUserId && mcardOwnerName && (
        <MCardContactDialog
          isOpen={isContactDialogOpen}
          onClose={() => setIsContactDialogOpen(false)}
          mcardId={mcardId}
          mcardOwnerName={mcardOwnerName}
          recipientId={mcardOwnerUserId}
          context={contactContext}
        />
      )}
    </>
  );
};
