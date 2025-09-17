import { Crown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const PremiumUpgrade = () => {
  const features = [
    "Thèmes et couleurs personnalisés",
    "Animations dynamiques avancées", 
    "Effets visuels (particules, ombres)",
    "Polices de caractères exclusives",
    "Factures personnalisables",
    "Support prioritaire"
  ];

  return (
    <Card className="border-2 border-gradient-to-r from-purple-200 to-blue-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
            <Crown className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Passez au plan Premium
        </h3>
        
        <p className="text-gray-600 mb-6">
          Débloquez toutes les fonctionnalités de personnalisation avancées pour créer une carte vraiment unique.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <Button 
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
          size="lg"
        >
          Passer au Premium - 5000 FCFA/mois
        </Button>
        
        <p className="text-xs text-gray-500 mt-3">
          Activation immédiate • Annulation à tout moment
        </p>
      </CardContent>
    </Card>
  );
};