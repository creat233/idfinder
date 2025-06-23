
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, MessageCircle } from "lucide-react";
import { MCardProduct } from "@/types/mcard";

interface MCardViewProductsProps {
  products?: MCardProduct[];
  phoneNumber?: string | null;
  isOwner: boolean;
  onAddProduct?: () => void;
}

export const MCardViewProducts = ({ 
  products = [], 
  phoneNumber, 
  isOwner, 
  onAddProduct 
}: MCardViewProductsProps) => {
  // Produits par défaut pour la démo
  const defaultProducts: MCardProduct[] = [
    {
      id: '1',
      mcard_id: 'demo',
      name: 'Site Web Vitrine',
      price: 150000,
      currency: 'FCFA',
      description: 'Site web professionnel avec design moderne',
      category: 'Web',
      image_url: '/lovable-uploads/254d1a55-a5b5-4de1-bb82-3495ca1b0d1f.png',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      mcard_id: 'demo',
      name: 'Application Mobile',
      price: 500000,
      currency: 'FCFA',
      description: 'App iOS/Android sur mesure',
      category: 'Mobile',
      image_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      mcard_id: 'demo',
      name: 'E-commerce',
      price: 300000,
      currency: 'FCFA',
      description: 'Boutique en ligne complète',
      category: 'Web',
      image_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      mcard_id: 'demo',
      name: 'Consultation 1h',
      price: 25000,
      currency: 'FCFA',
      description: 'Conseil technique personnalisé',
      category: 'Service',
      image_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  const handlePurchase = (product: MCardProduct) => {
    if (!phoneNumber) return;
    
    const message = `Bonjour ! Je suis intéressé(e) par votre service "${product.name}" à ${product.price.toLocaleString()} ${product.currency}. Pourriez-vous me donner plus d'informations ?`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Web': 'bg-blue-100 text-blue-800',
      'Mobile': 'bg-green-100 text-green-800',
      'Backend': 'bg-purple-100 text-purple-800',
      'Service': 'bg-orange-100 text-orange-800',
      'Formation': 'bg-yellow-100 text-yellow-800',
      'Marketing': 'bg-pink-100 text-pink-800',
      'Pack': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart className="h-5 w-5" />
            Mes Services & Produits
          </CardTitle>
          {isOwner && (
            <Button variant="outline" size="sm" onClick={onAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
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
              
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm">{product.name}</h3>
                <Badge className={getCategoryColor(product.category)}>
                  {product.category}
                </Badge>
              </div>
              
              {product.description && (
                <p className="text-gray-600 text-xs">{product.description}</p>
              )}
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-blue-600">
                  {product.price.toLocaleString()} {product.currency}
                </span>
                {!isOwner && (
                  <Button
                    size="sm"
                    onClick={() => handlePurchase(product)}
                    disabled={!phoneNumber}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Acheter
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {!phoneNumber && !isOwner && (
          <p className="text-center text-gray-500 mt-4 text-sm">
            Numéro de téléphone non disponible pour les achats
          </p>
        )}
      </CardContent>
    </Card>
  );
};
