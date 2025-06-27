
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, ShoppingCart } from 'lucide-react';
import { MCardProduct } from '@/types/mcard';
import { MCardViewProductDialog } from './MCardViewProductDialog';

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

  const activeProducts = products.filter(product => product.is_active);

  const handleProductClick = (product: MCardProduct) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  if (activeProducts.length === 0 && !isOwner) return null;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            🛍️ Produits & Services
          </h3>
          {isOwner && (
            <Button 
              size="sm" 
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          )}
        </div>

        {activeProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun produit ou service disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProducts.map((product) => (
              <div 
                key={product.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    {isOwner && (
                      <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      {product.price.toLocaleString()} {product.currency}
                    </span>
                    <ShoppingCart className="h-4 w-4 text-gray-400" />
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
    </>
  );
};
