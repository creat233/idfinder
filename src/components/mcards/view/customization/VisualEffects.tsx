import { Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface VisualEffectsProps {
  particlesEnabled: boolean;
  gradientsEnabled: boolean;
  shadowsEnabled: boolean;
  onParticlesChange: (enabled: boolean) => void;
  onGradientsChange: (enabled: boolean) => void;
  onShadowsChange: (enabled: boolean) => void;
}

export const VisualEffects = ({
  particlesEnabled,
  gradientsEnabled,
  shadowsEnabled,
  onParticlesChange,
  onGradientsChange,
  onShadowsChange
}: VisualEffectsProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-600" />
        Effets visuels avancés
      </h3>
      
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Particules animées</Label>
              <p className="text-xs text-gray-500">Ajoute des particules flottantes en arrière-plan</p>
            </div>
            <Switch
              checked={particlesEnabled}
              onCheckedChange={onParticlesChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Dégradés colorés</Label>
              <p className="text-xs text-gray-500">Active les dégradés de couleurs</p>
            </div>
            <Switch
              checked={gradientsEnabled}
              onCheckedChange={onGradientsChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Ombres élégantes</Label>
              <p className="text-xs text-gray-500">Ajoute des ombres sophistiquées</p>
            </div>
            <Switch
              checked={shadowsEnabled}
              onCheckedChange={onShadowsChange}
            />
          </div>
        </div>
    </div>
  );
};