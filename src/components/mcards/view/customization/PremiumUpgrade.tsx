import { Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PremiumUpgrade = () => {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="flex justify-center">
        <Lock className="h-12 w-12 text-gray-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Fonctionnalité Premium
        </h3>
        <p className="text-gray-600 mb-4">
          Accédez à des thèmes exclusifs et des options de personnalisation avancées
        </p>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <Crown className="h-4 w-4 mr-2" />
          Passer au Premium
        </Button>
      </div>
    </div>
  );
};