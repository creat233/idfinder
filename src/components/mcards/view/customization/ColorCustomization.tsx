import { Palette } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ColorCustomizationProps {
  primaryColor: string;
  secondaryColor: string;
  borderRadius: number;
  cardOpacity: number;
  onPrimaryColorChange: (color: string) => void;
  onSecondaryColorChange: (color: string) => void;
  onBorderRadiusChange: (radius: number) => void;
  onCardOpacityChange: (opacity: number) => void;
}

const presetColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
  '#1e293b', '#64748b',
];

export const ColorCustomization = ({
  primaryColor,
  secondaryColor,
  borderRadius,
  cardOpacity,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onBorderRadiusChange,
  onCardOpacityChange,
}: ColorCustomizationProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Palette className="h-5 w-5 text-indigo-600" />
        Couleurs & Style
      </h3>

      <div className="space-y-5 p-4 bg-gray-50 rounded-lg">
        {/* Primary Color */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Couleur principale</Label>
          <div className="flex items-center gap-2 flex-wrap">
            {presetColors.map((color) => (
              <button
                key={`p-${color}`}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  primaryColor === color ? 'border-gray-900 scale-110 ring-2 ring-offset-1 ring-gray-400' : 'border-gray-200 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onPrimaryColorChange(color)}
              />
            ))}
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => onPrimaryColorChange(e.target.value)}
              className="w-7 h-7 rounded-full cursor-pointer border border-gray-300"
            />
          </div>
        </div>

        {/* Secondary Color */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Couleur secondaire</Label>
          <div className="flex items-center gap-2 flex-wrap">
            {presetColors.map((color) => (
              <button
                key={`s-${color}`}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  secondaryColor === color ? 'border-gray-900 scale-110 ring-2 ring-offset-1 ring-gray-400' : 'border-gray-200 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onSecondaryColorChange(color)}
              />
            ))}
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => onSecondaryColorChange(e.target.value)}
              className="w-7 h-7 rounded-full cursor-pointer border border-gray-300"
            />
          </div>
        </div>

        {/* Preview gradient */}
        <div
          className="h-16 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            borderRadius: `${borderRadius}px`,
            opacity: cardOpacity / 100,
          }}
        />

        {/* Border Radius */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm font-medium">Arrondi des coins</Label>
            <span className="text-xs text-gray-500">{borderRadius}px</span>
          </div>
          <Slider
            value={[borderRadius]}
            onValueChange={([v]) => onBorderRadiusChange(v)}
            min={0}
            max={32}
            step={2}
          />
        </div>

        {/* Opacity */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm font-medium">Opacité</Label>
            <span className="text-xs text-gray-500">{cardOpacity}%</span>
          </div>
          <Slider
            value={[cardOpacity]}
            onValueChange={([v]) => onCardOpacityChange(v)}
            min={50}
            max={100}
            step={5}
          />
        </div>
      </div>
    </div>
  );
};
