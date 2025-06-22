
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  category: string;
}

interface MCardViewProductsProps {
  phoneNumber?: string | null;
}

export const MCardViewProducts = ({ phoneNumber }: MCardViewProductsProps) => {
  const products: Product[] = [
    {
      id: '1',
      name: 'Site Web Vitrine',
      price: 150000,
      currency: 'FCFA',
      description: 'Site web professionnel avec design moderne',
      category: 'Web'
    },
    {
      id: '2',
      name: 'Application Mobile',
      price: 500000,
      currency: 'FCFA',
      description: 'App iOS/Android sur mesure',
      category: 'Mobile'
    },
    {
      id: '3',
      name: 'E-commerce',
      price: 300000,
      currency: 'FCFA',
      description: 'Boutique en ligne complète',
      category: 'Web'
    },
    {
      id: '4',
      name: 'Consultation 1h',
      price: 25000,
      currency: 'FCFA',
      description: 'Conseil technique personnalisé',
      category: 'Service'
    },
    {
      id: '5',
      name: 'Formation React',
      price: 75000,
      currency: 'FCFA',
      description: 'Formation complète React.js',
      category: 'Formation'
    },
    {
      id: '6',
      name: 'API Backend',
      price: 200000,
      currency: 'FCFA',
      description: 'API REST sécurisée',
      category: 'Backend'
    },
    {
      id: '7',
      name: 'Maintenance Site',
      price: 50000,
      currency: 'FCFA',
      description: 'Maintenance mensuelle',
      category: 'Service'
    },
    {
      id: '8',
      name: 'SEO Optimization',
      price: 100000,
      currency: 'FCFA',
      description: 'Optimisation référencement',
      category: 'Marketing'
    },
    {
      id: '9',
      name: 'Pack Startup',
      price: 400000,
      currency: 'FCFA',
      description: 'Solution complète startup',
      category: 'Pack'
    }
  ];

  const handlePurchase = (product: Product) => {
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
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShoppingCart className="h-5 w-5" />
          Mes Services & Produits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm">{product.name}</h3>
                <Badge className={getCategoryColor(product.category)}>
                  {product.category}
                </Badge>
              </div>
              
              <p className="text-gray-600 text-xs">{product.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-blue-600">
                  {product.price.toLocaleString()} {product.currency}
                </span>
                <Button
                  size="sm"
                  onClick={() => handlePurchase(product)}
                  disabled={!phoneNumber}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Acheter
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {!phoneNumber && (
          <p className="text-center text-gray-500 mt-4 text-sm">
            Numéro de téléphone non disponible pour les achats
          </p>
        )}
      </CardContent>
    </Card>
  );
};
