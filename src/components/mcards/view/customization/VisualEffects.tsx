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
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      <h4 className="font-medium text-gray-900 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-green-600" />
        Effets visuels
      </h4>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Particules flottantes</Label>
          <Switch 
            checked={particlesEnabled}
            onCheckedChange={onParticlesChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label>Dégradés avancés</Label>
          <Switch 
            checked={gradientsEnabled}
            onCheckedChange={onGradientsChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label>Ombres dynamiques</Label>
          <Switch 
            checked={shadowsEnabled}
            onCheckedChange={onShadowsChange}
          />
        </div>
      </div>
    </div>
  );
};