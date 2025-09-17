import { Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface AnimationSettingsProps {
  animationsEnabled: boolean;
  animationSpeed: number;
  onAnimationsEnabledChange: (enabled: boolean) => void;
  onAnimationSpeedChange: (speed: number) => void;
}

export const AnimationSettings = ({
  animationsEnabled,
  animationSpeed,
  onAnimationsEnabledChange,
  onAnimationSpeedChange
}: AnimationSettingsProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Zap className="h-5 w-5 text-yellow-600" />
        Animations dynamiques
      </h3>
      
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <Label htmlFor="animations" className="text-sm font-medium">
            Activer les animations
          </Label>
          <Switch 
            id="animations"
            checked={animationsEnabled}
            onCheckedChange={onAnimationsEnabledChange}
          />
        </div>
        
        {animationsEnabled && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Vitesse d'animation: {animationSpeed}%
            </Label>
            <Slider
              value={[animationSpeed]}
              onValueChange={(value) => onAnimationSpeedChange(value[0])}
              min={10}
              max={100}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Lent</span>
              <span>Rapide</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};