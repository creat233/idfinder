
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles, Crown, Lock } from 'lucide-react';
import { MCard } from '@/types/mcard';

interface MCardViewCustomizationProps {
  mcard: MCard;
  isOwner?: boolean;
}

export const MCardViewCustomization = ({ 
  mcard, 
  isOwner 
}: MCardViewCustomizationProps) => {
  const [selectedTheme, setSelectedTheme] = useState('default');

  const themes = [
    { id: 'default', name: 'Classique', color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
    { id: 'modern', name: 'Moderne', color: 'bg-gradient-to-r from-gray-800 to-gray-900' },
    { id: 'elegant', name: 'Élégant', color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
    { id: 'professional', name: 'Professionnel', color: 'bg-gradient-to-r from-blue-600 to-indigo-600' },
    { id: 'creative', name: 'Créatif', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { id: 'nature', name: 'Nature', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
  ];

  const isPremium = mcard.plan === 'premium';

  if (!isOwner && !isPremium) return null;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-600" />
          Personnalisation avancée
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isPremium ? (
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
        ) : (
          <div className="space-y-6">
            {/* Thèmes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Thèmes et couleurs personnalisés
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTheme === theme.id 
                        ? 'border-purple-500 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <div className={`w-full h-20 rounded-lg mb-3 ${theme.color}`}></div>
                    <p className="text-sm font-medium text-center">{theme.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Options avancées */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Options avancées</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Animations personnalisées</h4>
                  <p className="text-sm text-gray-600 mb-3">Ajoutez des animations fluides à votre carte</p>
                  <Button size="sm" variant="outline">Configurer</Button>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Effets visuels</h4>
                  <p className="text-sm text-gray-600 mb-3">Particules, dégradés et effets spéciaux</p>
                  <Button size="sm" variant="outline">Configurer</Button>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Musique d'ambiance</h4>
                  <p className="text-sm text-gray-600 mb-3">Ajoutez une bande sonore à votre carte</p>
                  <Button size="sm" variant="outline">Configurer</Button>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Polices personnalisées</h4>
                  <p className="text-sm text-gray-600 mb-3">Choisissez parmi plus de 200 polices</p>
                  <Button size="sm" variant="outline">Configurer</Button>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="flex justify-end gap-2">
                <Button variant="outline">Aperçu</Button>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  Sauvegarder les modifications
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
