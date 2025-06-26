
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, Package, X } from "lucide-react";
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
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5" />
              Produits & Services
            </CardTitle>
            {canAddProduct && (
              <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            )}
          </div>
          {isOwner && mcardPlan !== 'premium' && (
            <p className="text-sm text-orange-600">
              🔒 Plan Premium requis pour ajouter des produits/services
            </p>
          )}
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun produit ou service défini</p>
              {canAddProduct && (
                <p className="text-sm mt-2">Cliquez sur "Ajouter" pour créer votre première offre</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow relative"
                >
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {/* Image du produit */}
                  {product.image_url && (
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{product.name}</h4>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600">{product.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">
                        {product.price} {product.currency}
                      </span>
                    </div>
                  </div>
                  
                  {!isOwner && phoneNumber && (
                    <Button
                      size="sm"
                      onClick={() => handleProductContact(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Commander / S'informer
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {!phoneNumber && !isOwner && products.length > 0 && (
            <p className="text-center text-gray-500 mt-4 text-sm">
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
