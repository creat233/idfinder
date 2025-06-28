
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Palette, Sparkles, Crown, Lock, Save, Eye, Volume2, Type, Zap } from 'lucide-react';
import { MCard } from '@/types/mcard';
import { useToast } from '@/hooks/use-toast';

interface MCardViewCustomizationProps {
  mcard: MCard;
  isOwner?: boolean;
}

export const MCardViewCustomization = ({ 
  mcard, 
  isOwner 
}: MCardViewCustomizationProps) => {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [animations, setAnimations] = useState({
    enabled: false,
    speed: 50,
    type: 'fade'
  });
  const [visualEffects, setVisualEffects] = useState({
    particles: false,
    gradients: true,
    shadows: true
  });
  const [backgroundMusic, setBackgroundMusic] = useState({
    enabled: false,
    volume: 30,
    track: 'ambient'
  });
  const [customFont, setCustomFont] = useState('Inter');
  const { toast } = useToast();

  const themes = [
    { id: 'default', name: 'Classique', color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
    { id: 'modern', name: 'Moderne', color: 'bg-gradient-to-r from-gray-800 to-gray-900' },
    { id: 'elegant', name: 'Élégant', color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
    { id: 'professional', name: 'Professionnel', color: 'bg-gradient-to-r from-blue-600 to-indigo-600' },
    { id: 'creative', name: 'Créatif', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { id: 'nature', name: 'Nature', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
  ];

  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 
    'Playfair Display', 'Merriweather', 'Dancing Script', 'Pacifico'
  ];

  const musicTracks = [
    { id: 'ambient', name: 'Ambiance Zen' },
    { id: 'corporate', name: 'Professionnel' },
    { id: 'upbeat', name: 'Dynamique' },
    { id: 'classical', name: 'Classique' }
  ];

  const isPremium = mcard.plan === 'premium';

  const handleSaveChanges = () => {
    // Simuler la sauvegarde des paramètres
    toast({
      title: "Paramètres sauvegardés !",
      description: "Vos modifications ont été appliquées avec succès."
    });
  };

  const handlePreview = () => {
    // Simuler l'aperçu
    toast({
      title: "Aperçu généré",
      description: "Un nouvel onglet va s'ouvrir avec l'aperçu de votre carte."
    });
    // Ouvrir l'aperçu dans un nouvel onglet
    window.open(`/mcard/${mcard.slug}?preview=true`, '_blank');
  };

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

            {/* Animations personnalisées */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">Animations personnalisées</h4>
                </div>
                <Switch 
                  checked={animations.enabled}
                  onCheckedChange={(checked) => setAnimations(prev => ({ ...prev, enabled: checked }))}
                />
              </div>
              
              {animations.enabled && (
                <div className="space-y-3">
                  <div>
                    <Label>Vitesse d'animation</Label>
                    <Slider
                      value={[animations.speed]}
                      onValueChange={(value) => setAnimations(prev => ({ ...prev, speed: value[0] }))}
                      max={100}
                      step={10}
                      className="mt-2"
                    />
                    <div className="text-xs text-gray-500 mt-1">Vitesse: {animations.speed}%</div>
                  </div>
                </div>
              )}
            </div>

            {/* Effets visuels */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Effets visuels
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Particules flottantes</Label>
                  <Switch 
                    checked={visualEffects.particles}
                    onCheckedChange={(checked) => setVisualEffects(prev => ({ ...prev, particles: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Dégradés avancés</Label>
                  <Switch 
                    checked={visualEffects.gradients}
                    onCheckedChange={(checked) => setVisualEffects(prev => ({ ...prev, gradients: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Ombres dynamiques</Label>
                  <Switch 
                    checked={visualEffects.shadows}
                    onCheckedChange={(checked) => setVisualEffects(prev => ({ ...prev, shadows: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Musique d'ambiance */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-gray-900">Musique d'ambiance</h4>
                </div>
                <Switch 
                  checked={backgroundMusic.enabled}
                  onCheckedChange={(checked) => setBackgroundMusic(prev => ({ ...prev, enabled: checked }))}
                />
              </div>
              
              {backgroundMusic.enabled && (
                <div className="space-y-3">
                  <div>
                    <Label>Piste audio</Label>
                    <select 
                      className="w-full mt-1 p-2 border rounded-md"
                      value={backgroundMusic.track}
                      onChange={(e) => setBackgroundMusic(prev => ({ ...prev, track: e.target.value }))}
                    >
                      {musicTracks.map(track => (
                        <option key={track.id} value={track.id}>{track.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label>Volume</Label>
                    <Slider
                      value={[backgroundMusic.volume]}
                      onValueChange={(value) => setBackgroundMusic(prev => ({ ...prev, volume: value[0] }))}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                    <div className="text-xs text-gray-500 mt-1">Volume: {backgroundMusic.volume}%</div>
                  </div>
                </div>
              )}
            </div>

            {/* Police personnalisée */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Type className="h-5 w-5 text-indigo-600" />
                Police personnalisée
              </h4>
              
              <div>
                <Label>Famille de police</Label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={customFont}
                  onChange={(e) => setCustomFont(e.target.value)}
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">Aperçu avec la police sélectionnée</div>
              </div>
            </div>

            {isOwner && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  onClick={handleSaveChanges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
