import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, Package, X, Share2, Facebook, Twitter, Linkedin, Send } from "lucide-react";
import { MCardProduct } from "@/types/mcard";
import { MCardViewProductDialog } from "./MCardViewProductDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MCardViewProductsProps {
  products: MCardProduct[];
  phoneNumber?: string | null;
  isOwner: boolean;
  mcardId?: string;
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleProductContact = (product: MCardProduct) => {
    if (!phoneNumber) return;
    
    const message = `Bonjour ! Je suis intéressé(e) par votre ${product.category.toLowerCase()} "${product.name}" au prix de ${product.price} ${product.currency}. Pourriez-vous me donner plus d'informations ?`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareProduct = (product: MCardProduct, platform: string) => {
    const baseUrl = window.location.origin;
    const cardUrl = window.location.href;
    const shareText = `Découvrez "${product.name}" - ${product.description} au prix de ${product.price} ${product.currency} sur ma carte de visite digitale`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cardUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(cardUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cardUrl)}&title=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${cardUrl}`)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(cardUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: shareText,
            text: shareText,
            url: cardUrl
          });
          return;
        }
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    toast({
      title: "Partage du produit",
      description: "Votre produit a été partagé !"
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('mcard_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès."
      });

      if (onProductsChange) {
        onProductsChange();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le produit."
      });
    }
  };

  const canAddProduct = isOwner && mcardPlan === 'premium';

  if (products.length === 0 && !isOwner) {
    return null;
  }

  return (
    <>
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <Package className="h-5 w-5 text-purple-600" />
              Produits & Services
            </CardTitle>
            {canAddProduct && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsDialogOpen(true)}
                className="bg-white/50 hover:bg-white/80 backdrop-blur-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            )}
          </div>
          {isOwner && mcardPlan !== 'premium' && (
            <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">
              🔒 Plan Premium requis pour ajouter des produits/services
            </p>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <p>Aucun produit ou service défini</p>
              {canAddProduct && (
                <p className="text-sm mt-2">Cliquez sur "Ajouter" pour créer votre première offre</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="border-0 rounded-xl p-4 space-y-4 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-100 hover:bg-red-200 rounded-full z-10"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <X className="h-3 w-3 text-red-600" />
                    </Button>
                  )}
                  
                  {/* Image du produit */}
                  {product.image_url && (
                    <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-lg text-gray-800">{product.name}</h4>
                      <Badge 
                        variant="secondary" 
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200"
                      >
                        {product.category}
                      </Badge>
                    </div>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {product.price} {product.currency}
                      </span>
                    </div>
                  </div>
                  
                  {/* Boutons d'action */}
                  <div className="space-y-3">
                    {!isOwner && phoneNumber && (
                      <Button
                        size="sm"
                        onClick={() => handleProductContact(product)}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Commander / S'informer
                      </Button>
                    )}
                    
                    {/* Boutons de partage */}
                    <div className="flex justify-center">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareProduct(product, 'whatsapp')}
                          className="h-8 w-8 p-0 bg-green-50 hover:bg-green-100 border-green-200"
                          title="Partager sur WhatsApp"
                        >
                          <MessageCircle className="h-3 w-3 text-green-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareProduct(product, 'telegram')}
                          className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200"
                          title="Partager sur Telegram"
                        >
                          <Send className="h-3 w-3 text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareProduct(product, 'facebook')}
                          className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200"
                          title="Partager sur Facebook"
                        >
                          <Facebook className="h-3 w-3 text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareProduct(product, 'twitter')}
                          className="h-8 w-8 p-0 bg-gray-50 hover:bg-gray-100 border-gray-200"
                          title="Partager sur Twitter"
                        >
                          <Twitter className="h-3 w-3 text-gray-900" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareProduct(product, 'linkedin')}
                          className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200"
                          title="Partager sur LinkedIn"
                        >
                          <Linkedin className="h-3 w-3 text-blue-700" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!phoneNumber && !isOwner && products.length > 0 && (
            <p className="text-center text-gray-500 mt-4 text-sm bg-gray-50 p-3 rounded-lg">
              Numéro de téléphone non disponible pour le contact
            </p>
          )}
        </CardContent>
      </Card>

      {mcardId && (
        <MCardViewProductDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          mcardId={mcardId}
          onProductAdded={() => {
            if (onProductsChange) {
              onProductsChange();
            }
          }}
        />
      )}
    </>
  );
};
