import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Palette, Layout, Sparkles, Type, Save, Eye, Paintbrush } from 'lucide-react';
import { useMCardCustomization } from '@/hooks/useMCardCustomization';
import { useToast } from '@/hooks/use-toast';

interface MCardAdvancedCustomizationProps {
  mcardId: string;
  isOwner: boolean;
}

export const MCardAdvancedCustomization = ({
  mcardId,
  isOwner
}: MCardAdvancedCustomizationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { customization, saveCustomization, loading } = useMCardCustomization(mcardId);
  const [localCustomization, setLocalCustomization] = useState(customization);
  const { toast } = useToast();

  // Thèmes prédéfinis
  const themes = [
    { id: 'default', name: 'Classique', colors: ['#3B82F6', '#8B5CF6'] },
    { id: 'modern', name: 'Moderne', colors: ['#1F2937', '#374151'] },
    { id: 'elegant', name: 'Élégant', colors: ['#7C3AED', '#EC4899'] },
    { id: 'professional', name: 'Professionnel', colors: ['#2563EB', '#4F46E5'] },
    { id: 'creative', name: 'Créatif', colors: ['#F59E0B', '#EF4444'] },
    { id: 'nature', name: 'Nature', colors: ['#10B981', '#059669'] },
    { id: 'sunset', name: 'Coucher de soleil', colors: ['#F97316', '#DC2626'] },
    { id: 'ocean', name: 'Océan', colors: ['#0EA5E9', '#06B6D4'] }
  ];

  // Polices disponibles
  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
    'Playfair Display', 'Merriweather', 'Dancing Script', 'Pacifico'
  ];

  // Types d'animations
  const animationTypes = [
    { id: 'fade', name: 'Fondu' },
    { id: 'slide', name: 'Glissement' },
    { id: 'bounce', name: 'Rebond' },
    { id: 'zoom', name: 'Zoom' },
    { id: 'rotate', name: 'Rotation' }
  ];

  const handleSave = async () => {
    try {
      await saveCustomization(localCustomization);
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la personnalisation"
      });
    }
  };

  const handlePreview = () => {
    // Ouvrir un aperçu dans un nouvel onglet
    window.open(`/${mcardId}?preview=true`, '_blank');
  };

  if (!isOwner) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
          <Paintbrush className="h-4 w-4 mr-2" />
          Personnalisation avancée
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            Personnalisation avancée de votre carte
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs defaultValue="themes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="themes">Thèmes</TabsTrigger>
              <TabsTrigger value="layout">Disposition</TabsTrigger>
              <TabsTrigger value="animations">Animations</TabsTrigger>
              <TabsTrigger value="fonts">Typographie</TabsTrigger>
            </TabsList>

            <TabsContent value="themes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thèmes de couleurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-colors ${
                          localCustomization.theme === theme.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => setLocalCustomization(prev => ({
                          ...prev,
                          theme: theme.id
                        }))}
                      >
                        <div className="flex gap-1 mb-2">
                          {theme.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <p className="text-sm font-medium">{theme.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Effets visuels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Dégradés</Label>
                    <Button
                      variant={localCustomization.gradients_enabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLocalCustomization(prev => ({
                        ...prev,
                        gradients_enabled: !prev.gradients_enabled
                      }))}
                    >
                      {localCustomization.gradients_enabled ? 'Activé' : 'Désactivé'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Ombres</Label>
                    <Button
                      variant={localCustomization.shadows_enabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLocalCustomization(prev => ({
                        ...prev,
                        shadows_enabled: !prev.shadows_enabled
                      }))}
                    >
                      {localCustomization.shadows_enabled ? 'Activé' : 'Désactivé'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Particules animées</Label>
                    <Button
                      variant={localCustomization.particles_enabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLocalCustomization(prev => ({
                        ...prev,
                        particles_enabled: !prev.particles_enabled
                      }))}
                    >
                      {localCustomization.particles_enabled ? 'Activé' : 'Désactivé'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="animations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Animations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Activer les animations</Label>
                    <Button
                      variant={localCustomization.animations_enabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLocalCustomization(prev => ({
                        ...prev,
                        animations_enabled: !prev.animations_enabled
                      }))}
                    >
                      {localCustomization.animations_enabled ? 'Activé' : 'Désactivé'}
                    </Button>
                  </div>

                  {localCustomization.animations_enabled && (
                    <>
                      <div className="space-y-2">
                        <Label>Type d'animation</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {animationTypes.map((type) => (
                            <Button
                              key={type.id}
                              variant={localCustomization.animation_type === type.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setLocalCustomization(prev => ({
                                ...prev,
                                animation_type: type.id
                              }))}
                            >
                              {type.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Vitesse d'animation: {localCustomization.animation_speed}%</Label>
                        <Slider
                          value={[localCustomization.animation_speed]}
                          onValueChange={(value) => setLocalCustomization(prev => ({
                            ...prev,
                            animation_speed: value[0]
                          }))}
                          max={100}
                          min={10}
                          step={10}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fonts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Police de caractères</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {fonts.map((font) => (
                      <div
                        key={font}
                        className={`cursor-pointer p-3 rounded-lg border-2 transition-colors ${
                          localCustomization.custom_font === font
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => setLocalCustomization(prev => ({
                          ...prev,
                          custom_font: font
                        }))}
                      >
                        <p className="text-sm font-medium" style={{ fontFamily: font }}>
                          {font}
                        </p>
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: font }}>
                          Aperçu de la police
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Aperçu des changements */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-800">Aperçu en temps réel</h4>
                  <p className="text-sm text-blue-600">
                    Vos modifications sont appliquées instantanément
                  </p>
                </div>
                <Button onClick={handlePreview} variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir l'aperçu
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                'Sauvegarde...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};