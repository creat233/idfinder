
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Crown } from 'lucide-react';
import { MCard } from '@/types/mcard';
import { useToast } from '@/hooks/use-toast';
import { URL_CONFIG } from '@/utils/urlConfig';
import { useMCardCustomization } from '@/hooks/useMCardCustomization';
import { ThemeSelector } from './customization/ThemeSelector';
import { AnimationSettings } from './customization/AnimationSettings';
import { VisualEffects } from './customization/VisualEffects';
import { FontCustomization } from './customization/FontCustomization';
import { PremiumUpgrade } from './customization/PremiumUpgrade';
import { CustomizationActions } from './customization/CustomizationActions';

interface MCardViewCustomizationProps {
  mcard: MCard;
  isOwner?: boolean;
}

export const MCardViewCustomization = ({ 
  mcard, 
  isOwner 
}: MCardViewCustomizationProps) => {
  const { customization, saveCustomization, loading } = useMCardCustomization(mcard.id);
  const { toast } = useToast();

  const isPremium = mcard.plan === 'premium' || mcard.plan === 'ultimate';

  const updateCustomization = async (updates: any) => {
    try {
      await saveCustomization(updates);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await saveCustomization(customization);
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  const handlePreview = () => {
    toast({
      title: "Aperçu généré",
      description: "Un nouvel onglet va s'ouvrir avec l'aperçu de votre carte."
    });
    const previewUrl = `${URL_CONFIG.getBaseUrl()}/mcard/${mcard.slug}?preview=true`;
    window.open(previewUrl, '_blank');
  };

  // Ne pas afficher cette section pour les visiteurs non connectés
  if (!isOwner) return null;

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">Chargement de la personnalisation...</div>
        </CardContent>
      </Card>
    );
  }

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
          <PremiumUpgrade />
        ) : (
          <div className="space-y-6">
            <ThemeSelector
              selectedTheme={customization.theme}
              onThemeChange={(theme) => updateCustomization({ theme })}
            />

            <AnimationSettings
              animationsEnabled={customization.animations_enabled}
              animationSpeed={customization.animation_speed}
              onAnimationsEnabledChange={(enabled) => updateCustomization({ animations_enabled: enabled })}
              onAnimationSpeedChange={(speed) => updateCustomization({ animation_speed: speed })}
            />

            <VisualEffects
              particlesEnabled={customization.particles_enabled}
              gradientsEnabled={customization.gradients_enabled}
              shadowsEnabled={customization.shadows_enabled}
              onParticlesChange={(enabled) => updateCustomization({ particles_enabled: enabled })}
              onGradientsChange={(enabled) => updateCustomization({ gradients_enabled: enabled })}
              onShadowsChange={(enabled) => updateCustomization({ shadows_enabled: enabled })}
            />

            <FontCustomization
              selectedFont={customization.custom_font}
              onFontChange={(font) => updateCustomization({ custom_font: font })}
            />

            <CustomizationActions
              isOwner={isOwner}
              loading={loading}
              onPreview={handlePreview}
              onSave={handleSaveChanges}
              mcardSlug={mcard.slug}
              mcardPlan={mcard.plan}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
