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
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <h4 className="font-medium text-gray-900">Animations personnalisées</h4>
        </div>
        <Switch 
          checked={animationsEnabled}
          onCheckedChange={onAnimationsEnabledChange}
        />
      </div>
      
      {animationsEnabled && (
        <div className="space-y-3">
          <div>
            <Label>Vitesse d'animation</Label>
            <Slider
              value={[animationSpeed]}
              onValueChange={(value) => onAnimationSpeedChange(value[0])}
              max={100}
              step={10}
              className="mt-2"
            />
            <div className="text-xs text-gray-500 mt-1">Vitesse: {animationSpeed}%</div>
          </div>
        </div>
      )}
    </div>
  );
};