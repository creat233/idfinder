
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Palette, Sparkles, Crown, Lock, Save, Eye, Type, Zap } from 'lucide-react';
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
    speed: 50
  });
  const [visualEffects, setVisualEffects] = useState({
    particles: false,
    gradients: true,
    shadows: true
  });
  const [customFont, setCustomFont] = useState('Inter');
  const { toast } = useToast();

  const themes = [
    { id: 'default', name: 'Classique', gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' },
    { id: 'modern', name: 'Moderne', gradient: 'linear-gradient(135deg, #374151, #111827)' },
    { id: 'elegant', name: 'Élégant', gradient: 'linear-gradient(135deg, #9333ea, #ec4899)' },
    { id: 'professional', name: 'Professionnel', gradient: 'linear-gradient(135deg, #2563eb, #4f46e5)' },
    { id: 'creative', name: 'Créatif', gradient: 'linear-gradient(135deg, #f97316, #ef4444)' },
    { id: 'nature', name: 'Nature', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  ];

  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 
    'Playfair Display', 'Merriweather', 'Dancing Script', 'Pacifico'
  ];

  const isPremium = mcard.plan === 'premium';

  // Appliquer le thème immédiatement
  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme && isPremium) {
      // Retirer toutes les classes de thème existantes
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
      // Ajouter la nouvelle classe de thème
      document.body.classList.add(`theme-${themeId}`);
      // Définir la variable CSS
      document.documentElement.style.setProperty('--theme-gradient', theme.gradient);
      console.log(`Thème appliqué: ${themeId}`, theme.gradient);
    }
  };

  // Appliquer la police immédiatement
  const applyFont = (fontName: string) => {
    if (isPremium) {
      document.documentElement.style.setProperty('--custom-font', `'${fontName}', sans-serif`);
      document.body.style.fontFamily = `'${fontName}', sans-serif`;
      console.log(`Police appliquée: ${fontName}`);
    }
  };

  // Appliquer les effets visuels immédiatement
  const applyVisualEffects = (effects: typeof visualEffects) => {
    if (isPremium) {
      const body = document.body;
      
      // Particules
      if (effects.particles) {
        body.classList.add('particles-enabled');
      } else {
        body.classList.remove('particles-enabled');
      }
      
      // Dégradés
      if (effects.gradients) {
        body.classList.add('gradients-enabled');
      } else {
        body.classList.remove('gradients-enabled');
      }
      
      // Ombres
      if (effects.shadows) {
        body.classList.add('shadows-enabled');
      } else {
        body.classList.remove('shadows-enabled');
      }
      
      console.log('Effets visuels appliqués:', effects);
    }
  };

  // Gestionnaires d'événements
  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    applyTheme(themeId);
    toast({
      title: "Thème appliqué !",
      description: `Le thème ${themes.find(t => t.id === themeId)?.name} a été activé.`
    });
  };

  const handleFontChange = (font: string) => {
    setCustomFont(font);
    applyFont(font);
    toast({
      title: "Police changée !",
      description: `La police ${font} a été appliquée.`
    });
  };

  const handleVisualEffectChange = (effectType: keyof typeof visualEffects, value: boolean) => {
    const newEffects = { ...visualEffects, [effectType]: value };
    setVisualEffects(newEffects);
    applyVisualEffects(newEffects);
    
    const effectNames = {
      particles: 'Particules',
      gradients: 'Dégradés',
      shadows: 'Ombres'
    };
    
    toast({
      title: `${effectNames[effectType]} ${value ? 'activé' : 'désactivé'}`,
      description: "L'effet a été appliqué immédiatement."
    });
  };

  // Appliquer les effets au chargement
  useEffect(() => {
    if (isPremium) {
      applyTheme(selectedTheme);
      applyFont(customFont);
      applyVisualEffects(visualEffects);
    }
  }, [isPremium]);

  const handleSaveChanges = () => {
    toast({
      title: "Paramètres sauvegardés !",
      description: "Vos modifications ont été appliquées avec succès."
    });
  };

  const handlePreview = () => {
    window.open(`/mcard/${mcard.slug}?preview=true`, '_blank');
  };

  if (!isOwner) return null;

  return (
    <Card className="shadow-lg card-enhanced">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-600" />
          Personnalisation avancée
          {isPremium && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
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
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Thèmes personnalisés
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
                    onClick={() => handleThemeChange(theme.id)}
                  >
                    <div 
                      className="w-full h-20 rounded-lg mb-3"
                      style={{ background: theme.gradient }}
                    ></div>
                    <p className="text-sm font-medium text-center">{theme.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Police personnalisée */}
            <div className="p-4 bg-white/50 rounded-lg space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Type className="h-5 w-5 text-indigo-600" />
                Police personnalisée
              </h4>
              
              <div>
                <Label>Famille de police</Label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md bg-white"
                  value={customFont}
                  onChange={(e) => handleFontChange(e.target.value)}
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
                <div 
                  className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded"
                  style={{ fontFamily: `'${customFont}', sans-serif` }}
                >
                  Aperçu avec la police {customFont}
                </div>
              </div>
            </div>

            {/* Effets visuels */}
            <div className="p-4 bg-white/50 rounded-lg space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Effets visuels
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Particules flottantes</Label>
                  <Switch 
                    checked={visualEffects.particles}
                    onCheckedChange={(checked) => handleVisualEffectChange('particles', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Dégradés avancés</Label>
                  <Switch 
                    checked={visualEffects.gradients}
                    onCheckedChange={(checked) => handleVisualEffectChange('gradients', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Ombres dynamiques</Label>
                  <Switch 
                    checked={visualEffects.shadows}
                    onCheckedChange={(checked) => handleVisualEffectChange('shadows', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Animations */}
            <div className="p-4 bg-white/50 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Animations</h4>
                </div>
                <Switch 
                  checked={animations.enabled}
                  onCheckedChange={(checked) => {
                    setAnimations(prev => ({ ...prev, enabled: checked }));
                    toast({
                      title: checked ? "Animations activées" : "Animations désactivées",
                      description: "Les animations ont été mises à jour."
                    });
                  }}
                />
              </div>
              
              {animations.enabled && (
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
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={handlePreview} className="btn-enhanced">
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white btn-enhanced"
                onClick={handleSaveChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
