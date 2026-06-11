import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Save, Eye, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useMCardCustomization, MCardCustomization } from '@/hooks/useMCardCustomization';
import { MCard } from '@/types/mcard';
import { URL_CONFIG } from '@/utils/urlConfig';

import { ThemeSelector } from '@/components/mcards/view/customization/ThemeSelector';
import { ColorCustomization } from '@/components/mcards/view/customization/ColorCustomization';
import { FontCustomization } from '@/components/mcards/view/customization/FontCustomization';
import { AnimationSettings } from '@/components/mcards/view/customization/AnimationSettings';
import { VisualEffects } from '@/components/mcards/view/customization/VisualEffects';
import { TemplateSelector } from '@/components/mcards/view/customization/TemplateSelector';
import { BackgroundImageUpload } from '@/components/mcards/view/customization/BackgroundImageUpload';
import { LivePreview } from '@/components/mcards/view/customization/LivePreview';

const DEFAULT_CUSTOMIZATION: Partial<MCardCustomization> = {
  theme: 'default',
  animations_enabled: false,
  animation_speed: 50,
  animation_type: 'fade',
  particles_enabled: false,
  gradients_enabled: true,
  shadows_enabled: true,
  mask_enabled: false,
  custom_font: 'Inter',
  background_image_url: null,
  primary_color: '#6366f1',
  secondary_color: '#ec4899',
  border_radius: 16,
  card_opacity: 100,
};

const MCardCustomize = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [mcard, setMcard] = useState<MCard | null>(null);
  const [loadingCard, setLoadingCard] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data, error } = await supabase
        .from('mcards')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (error || !data) {
        toast({ title: 'Carte introuvable', variant: 'destructive' });
        navigate('/mes-cartes');
        return;
      }
      setMcard(data as MCard);
      setLoadingCard(false);
    })();
  }, [slug]);

  const { customization, setCustomization, saveCustomization, loading } = useMCardCustomization(mcard?.id ?? '');

  if (loadingCard || loading || !mcard) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Bloquer si pas le propriétaire
  if (user?.id !== mcard.user_id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div>
          <p className="text-lg font-semibold">Accès refusé</p>
          <p className="text-sm text-gray-500 mt-2">Vous n'êtes pas le propriétaire de cette carte.</p>
          <Button className="mt-4" onClick={() => navigate(`/mcard/${slug}`)}>Retour</Button>
        </div>
      </div>
    );
  }

  const update = (patch: Partial<MCardCustomization>) => {
    setCustomization({ ...customization, ...patch });
  };

  const applyTemplate = (preset: Partial<MCardCustomization>) => {
    setCustomization({ ...customization, ...preset });
    toast({ title: 'Modèle appliqué', description: 'N\'oubliez pas de sauvegarder.' });
  };

  const reset = () => {
    setCustomization({ ...customization, ...DEFAULT_CUSTOMIZATION });
    toast({ title: 'Réinitialisé', description: 'Sauvegardez pour appliquer.' });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveCustomization(customization);
    } finally {
      setSaving(false);
    }
  };

  const openPreview = () => {
    window.open(`${URL_CONFIG.getBaseUrl()}/mcard/${slug}?preview=true`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/mcard/${slug}`)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Retour
          </Button>
          <h1 className="font-semibold text-sm sm:text-base truncate">Personnaliser ma carte</h1>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={reset} title="Réinitialiser">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={openPreview} title="Aperçu">
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
              <span className="hidden sm:inline">Sauvegarder</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Controls */}
        <Card className="shadow-lg">
          <CardContent className="p-3 sm:p-5">
            <Tabs defaultValue="design" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4 w-full">
                <TabsTrigger value="design" className="text-xs sm:text-sm">Design</TabsTrigger>
                <TabsTrigger value="visuel" className="text-xs sm:text-sm">Visuel</TabsTrigger>
                <TabsTrigger value="effets" className="text-xs sm:text-sm">Effets</TabsTrigger>
                <TabsTrigger value="modeles" className="text-xs sm:text-sm">Modèles</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-6">
                <ThemeSelector
                  selectedTheme={customization.theme}
                  onThemeChange={(theme) => update({ theme })}
                />
                <ColorCustomization
                  primaryColor={customization.primary_color || '#6366f1'}
                  secondaryColor={customization.secondary_color || '#ec4899'}
                  borderRadius={customization.border_radius || 16}
                  cardOpacity={customization.card_opacity || 100}
                  onPrimaryColorChange={(c) => update({ primary_color: c })}
                  onSecondaryColorChange={(c) => update({ secondary_color: c })}
                  onBorderRadiusChange={(r) => update({ border_radius: r })}
                  onCardOpacityChange={(o) => update({ card_opacity: o })}
                />
                <FontCustomization
                  selectedFont={customization.custom_font}
                  onFontChange={(font) => update({ custom_font: font })}
                />
              </TabsContent>

              <TabsContent value="visuel" className="space-y-6">
                <BackgroundImageUpload
                  mcardId={mcard.id}
                  currentUrl={mcard.cover_image_url}
                  onChange={(url) => setMcard({ ...mcard, cover_image_url: url })}
                />
              </TabsContent>


              <TabsContent value="effets" className="space-y-6">
                <AnimationSettings
                  animationsEnabled={customization.animations_enabled}
                  animationSpeed={customization.animation_speed}
                  onAnimationsEnabledChange={(v) => update({ animations_enabled: v })}
                  onAnimationSpeedChange={(v) => update({ animation_speed: v })}
                />
                <VisualEffects
                  particlesEnabled={customization.particles_enabled}
                  gradientsEnabled={customization.gradients_enabled}
                  shadowsEnabled={customization.shadows_enabled}
                  maskEnabled={customization.mask_enabled}
                  onParticlesChange={(v) => update({ particles_enabled: v })}
                  onGradientsChange={(v) => update({ gradients_enabled: v })}
                  onShadowsChange={(v) => update({ shadows_enabled: v })}
                  onMaskChange={(v) => update({ mask_enabled: v })}
                />
              </TabsContent>

              <TabsContent value="modeles" className="space-y-6">
                <TemplateSelector onApply={applyTemplate} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <div className="hidden lg:block">
          <LivePreview customization={customization} mcard={mcard} />
        </div>

        {/* Mobile preview - collapsed below */}
        <div className="lg:hidden">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <LivePreview customization={customization} mcard={mcard} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MCardCustomize;
