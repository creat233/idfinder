import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, CreditCard, Truck, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MCard } from "@/types/mcard";

interface MCardPhysicalProductsProps {
  mcard: MCard;
  isOwner: boolean;
}

const PHYSICAL_PRODUCTS = [
  {
    id: 'business_card',
    name: 'Cartes de visite (100 pièces)',
    description: 'Pack de 100 cartes de visite avec QR code personnalisé',
    price: 25000,
    image: '📇',
    features: ['100 cartes de visite', 'QR code avec vos informations', 'Design professionnel', 'Matériau premium']
  },
  {
    id: 'digital_badge',
    name: 'Badge digital (unité)',
    description: 'Badge professionnel avec QR code intégré',
    price: 15000,
    image: '🏷️',
    features: ['Support métallique', 'QR code gravé', 'Résistant à l\'eau', 'Clip de fixation inclus']
  },
  {
    id: 'sticker_label',
    name: 'Étiquette autocollante',
    description: 'Étiquettes adhésives avec QR code Mcard',
    price: 3000,
    image: '🏷️',
    features: ['Pack de 10 étiquettes', 'Résistant aux intempéries', 'Adhésif forte tenue']
  },
  {
    id: 'digital_board',
    name: 'Tableau digital',
    description: 'Panneau d\'affichage avec QR code grand format',
    price: 25000,
    image: '📋',
    features: ['Format A4', 'Support rigide', 'QR code haute définition', 'Informations complètes']
  }
];

export const MCardPhysicalProducts = ({ mcard, isOwner }: MCardPhysicalProductsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<typeof PHYSICAL_PRODUCTS[0] | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const { toast } = useToast();

  if (!isOwner || mcard.subscription_status !== 'active') {
    return null;
  }

  const handleOrderProduct = (product: typeof PHYSICAL_PRODUCTS[0]) => {
    setSelectedProduct(product);
    setIsOrderDialogOpen(true);
  };

  const handleConfirmOrder = () => {
    toast({
      title: "Commande enregistrée !",
      description: `Votre commande pour ${selectedProduct?.name} a été enregistrée. Nous vous contacterons dans les 24h pour la confirmation et la livraison.`,
    });
    setIsOrderDialogOpen(false);
    setSelectedProduct(null);
  };

  const generateQRCodeURL = () => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/m/${mcard.slug}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&format=png&ecc=H`;
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Package className="h-6 w-6" />
          Produits Physiques Personnalisés
          <Badge className="bg-purple-600 text-white">Nouveau</Badge>
        </CardTitle>
        <p className="text-purple-600">
          Commandez vos supports physiques avec QR code Mcard personnalisé
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PHYSICAL_PRODUCTS.map((product) => (
            <Card key={product.id} className="border border-purple-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{product.image}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-purple-600">{product.price} FCFA</span>
                      <Badge variant="outline" className="text-xs">Avec QR Code</Badge>
                    </div>
                  </div>
                </div>
                
                <ul className="text-xs text-gray-600 mb-3 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleOrderProduct(product)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Commander
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Aperçu du QR Code */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Aperçu de votre QR Code personnalisé
          </h4>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative">
              <img 
                src={generateQRCodeURL()} 
                alt="QR Code Mcard"
                className="w-32 h-32 border-2 border-purple-300 rounded-lg shadow-md"
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full border border-purple-300 shadow-sm">
                <span className="text-xs font-bold text-purple-600">Mcard Digital</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-800 mb-2">Ce QR code sera intégré sur tous vos produits physiques :</p>
              <ul className="space-y-1">
                <li>• Redirection vers votre carte digitale</li>
                <li>• Design "Mcard" personnalisé</li>
                <li>• Haute qualité pour impression</li>
                <li>• Compatible avec tous les scanners</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Dialog de commande */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Confirmer la commande
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{selectedProduct.image}</span>
                  <div>
                    <h3 className="font-semibold">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                  </div>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  Prix: {selectedProduct.price} FCFA
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Informations de livraison
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Livraison sous 3-5 jours ouvrables</li>
                  <li>• Frais de livraison: 2000 FCFA (Dakar)</li>
                  <li>• Paiement à la livraison disponible</li>
                  <li>• Contact par WhatsApp pour confirmation</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsOrderDialogOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleConfirmOrder}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Confirmer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};