
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, ShoppingCart, Share2, MessageCircle, Star } from 'lucide-react';
import { MCardProduct } from '@/types/mcard';
import { MCardViewProductDialog } from './MCardViewProductDialog';
import { MCardViewAddProductDialog } from './MCardViewAddProductDialog';
import { MCardViewEditProductDialog } from './MCardViewEditProductDialog';
import { ProductImageModal } from './ProductImageModal';
import { useToast } from '@/hooks/use-toast';

interface MCardViewProductsProps {
  products: MCardProduct[];
  phoneNumber?: string;
  isOwner?: boolean;
  mcardId: string;
  mcardPlan?: string;
  onProductsChange?: () => void;
}

export const MCardViewProducts = ({ 
  products, 
  phoneNumber, 
  isOwner, 
  mcardId, 
  mcardPlan,
  onProductsChange 
}: MCardViewProductsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<MCardProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MCardProduct | null>(null);
  const { toast } = useToast();

  const activeProducts = products.filter(product => product.is_active);
  const isPremium = mcardPlan === 'premium';
  const canAddProduct = isOwner && isPremium;

  const handleProductClick = (product: MCardProduct) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = () => {
    setIsAddDialogOpen(true);
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

  if (activeProducts.length === 0 && !canAddProduct) return null;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {activeProducts.map((product) => (
              <div 
                key={product.id} 
                className="border rounded-xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                {product.image_url && (
                  <ProductImageModal
                    imageUrl={product.image_url}
                    product={product}
                  >
                    <div className="relative group mb-4">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-48 md:h-56 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
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
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-gray-900 cursor-pointer hover:text-blue-600 transition-colors mb-2" onClick={() => handleProductClick(product)}>
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
                    )}
                  </div>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                    <span className="text-2xl font-bold text-green-600">
                      {product.price.toLocaleString()} {product.currency}
                    </span>
                    <ShoppingCart className="h-6 w-6 text-green-500" />
                  </div>

                  {/* Boutons de partage améliorés */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShareProduct(product)}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:scale-105 transition-all flex-1 shadow-sm"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleWhatsAppShare(product)}
                      className="text-green-600 border-green-600 hover:bg-green-50 hover:scale-105 transition-all flex-1 shadow-sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
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
      />

      {canAddProduct && (
        <MCardViewAddProductDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          mcardId={mcardId}
          onProductAdded={handleProductAdded}
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
    </>
  );
};
