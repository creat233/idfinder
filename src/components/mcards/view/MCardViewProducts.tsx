
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, ShoppingCart, Share2, MessageCircle } from 'lucide-react';
import { MCardProduct } from '@/types/mcard';
import { MCardViewProductDialog } from './MCardViewProductDialog';
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
  const { toast } = useToast();

  const activeProducts = products.filter(product => product.is_active);

  const handleProductClick = (product: MCardProduct) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleShareProduct = (product: MCardProduct) => {
    const shareText = `🛍️ Produit: ${product.name} - ${product.price.toLocaleString()} ${product.currency}\n\n📱 Voir ma mCard: ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mon Produit - FinderID',
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
    const message = encodeURIComponent(`🛍️ Découvrez mon produit: ${product.name}\n💰 Prix: ${product.price.toLocaleString()} ${product.currency}\n📋 Catégorie: ${product.category}\n\n📱 Voir ma mCard complète: ${window.location.href}\n\n#FinderID`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = (product: MCardProduct) => {
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`🛍️ Découvrez mon produit: ${product.name} - ${product.price.toLocaleString()} ${product.currency}`);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${text}`;
    window.open(facebookUrl, '_blank');
  };

  const handleTwitterShare = (product: MCardProduct) => {
    const text = encodeURIComponent(`🛍️ Découvrez mon produit: ${product.name}\n💰 ${product.price.toLocaleString()} ${product.currency}\n\n📱 Ma mCard: ${window.location.href}\n\n#FinderID #Commerce`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(twitterUrl, '_blank');
  };

  const handleLinkedInShare = (product: MCardProduct) => {
    const shareUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`${product.name} - ${product.price.toLocaleString()} ${product.currency}`);
    const summary = encodeURIComponent(`Découvrez mon produit: ${product.name}. Catégorie: ${product.category}`);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${title}&summary=${summary}`;
    window.open(linkedinUrl, '_blank');
  };

  if (activeProducts.length === 0 && !isOwner) return null;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
            🛍️ Produits & Services
          </h3>
          {isOwner && (
            <Button 
              size="sm" 
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50 w-full sm:w-auto"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {activeProducts.map((product) => (
              <div 
                key={product.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-all"
              >
                {product.image_url && (
                  <div className="relative">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-32 md:h-40 object-cover rounded-lg mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleProductClick(product)}
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleProductClick(product)}>
                      {product.name}
                    </h4>
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

                  {/* Boutons de partage sur les réseaux sociaux */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShareProduct(product)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50 flex-1 min-w-0"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Partager
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWhatsAppShare(product)}
                        className="text-green-600 border-green-600 hover:bg-green-50 flex-1 min-w-0"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFacebookShare(product)}
                        className="text-blue-800 border-blue-800 hover:bg-blue-50 flex-1 min-w-0"
                      >
                        📘 Facebook
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTwitterShare(product)}
                        className="text-black border-gray-800 hover:bg-gray-50 flex-1 min-w-0"
                      >
                        🐦 Twitter
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLinkedInShare(product)}
                        className="text-blue-700 border-blue-700 hover:bg-blue-50 flex-1 min-w-0"
                      >
                        💼 LinkedIn
                      </Button>
                    </div>
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
