
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  subscriptionStatus?: string;
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
  subscriptionStatus,
  onProductsChange,
  onOptimisticProductAdd 
}: MCardViewProductsProps) => {
  const navigate = useNavigate();
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
  
  const isPaidPlan = mcardPlan === 'premium' || mcardPlan === 'essential' || mcardPlan === 'ultimate' || mcardPlan === 'free';
  const isCardActive = subscriptionStatus === 'active' || subscriptionStatus === 'trial';
  const canAddProduct = isOwner && isPaidPlan && isCardActive;

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
    if (checkProductLimit(subscriptionStatus)) {
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
        return 'Contacter';
      case 'produit':
        return 'Acheter';
      case 'menu restaurant':
        return 'Commander';
      case 'consultation':
        return 'Rendez-Vous';
      case 'formation':
        return 'S\'inscrire';
      case 'événement':
        return 'Réserver';
      case 'article':
        return 'Contacter';
      case 'autre':
        return 'Contacter';
      default:
        return 'Contacter';
    }
  };

  if (activeProducts.length === 0 && !canAddProduct) return null;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mx-1 sm:mx-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            🛍️ <span className="truncate">Produits & Services</span>
          </h3>
          <div className="flex gap-2 flex-shrink-0">
            {activeProducts.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigate(`all-products`, {
                    state: { products: activeProducts, mcardId, ownerName: mcardOwnerName || '', ownerUserId: mcardOwnerUserId || '' }
                  });
                }}
                className="text-purple-600 border-purple-600 hover:bg-purple-50 text-xs sm:text-sm h-8 sm:h-9"
              >
                <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden xs:inline">Voir tout</span>
                <span className="xs:hidden">Tout</span>
              </Button>
            )}
            {canAddProduct && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleAddProduct}
                className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs sm:text-sm h-8 sm:h-9"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Ajouter</span>
              </Button>
            )}
          </div>
        </div>

        {activeProducts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            {canAddProduct ? (
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-2">
                  <ShoppingCart className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <p className="text-gray-600 text-base sm:text-lg font-medium">Pas encore de produits</p>
                <p className="text-gray-500 text-xs sm:text-sm px-4">Ajoutez votre premier produit ou service</p>
                <Button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700 mt-2 text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-2">
                  <ShoppingCart className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-base sm:text-lg">Pas encore de produits</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {activeProducts.map((product) => (
              <div 
                key={product.id} 
                className="border rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 active:scale-[0.99]"
              >
                {product.image_url && (
                  <ProductImageModal
                    imageUrl={product.image_url}
                    product={product}
                  >
                    <div className="relative group mb-3">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-36 sm:h-44 md:h-48 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </ProductImageModal>
                )}
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="font-bold text-base sm:text-lg text-gray-900 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2" 
                        onClick={() => handleProductClick(product)}
                      >
                        {product.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs font-medium mt-1">
                        <Star className="w-3 h-3 mr-1" />
                        {product.category}
                      </Badge>
                    </div>
                    {isOwner && (
                      <div className="flex gap-1 flex-shrink-0">
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
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {product.description && (
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <span className="text-lg sm:text-xl font-bold text-green-600">
                      {product.price.toLocaleString()} {product.currency}
                    </span>
                    <ShoppingCart className="h-5 w-5 text-green-500" />
                  </div>

                  {/* Boutons d'action - responsive */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShareProduct(product)}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs h-9 active:scale-95"
                    >
                      <Share2 className="h-3.5 w-3.5 mr-1" />
                      Partager
                    </Button>
                    
                    {!isOwner ? (
                      <Button
                        size="sm"
                        variant={isInCart(product.id) ? "default" : "outline"}
                        onClick={() => handleAddToCart(product)}
                        disabled={isInCart(product.id)}
                        className={`${
                          isInCart(product.id)
                            ? "bg-green-600 text-white"
                            : "text-green-600 border-green-600 hover:bg-green-50"
                        } text-xs h-9 active:scale-95`}
                      >
                        <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                        {isInCart(product.id) ? "Ajouté" : "Panier"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleProductClick(product)}
                        className="text-gray-600 border-gray-300 hover:bg-gray-50 text-xs h-9"
                      >
                        Détails
                      </Button>
                    )}
                  </div>
                  
                  {!isOwner && (
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
                      className="w-full text-purple-600 border-purple-600 hover:bg-purple-50 text-xs h-9 active:scale-95"
                    >
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      {getActionButtonText(product.category)}
                    </Button>
                  )}
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
          mcardPlan={mcardPlan}
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
