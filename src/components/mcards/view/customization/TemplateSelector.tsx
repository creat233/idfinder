import { Briefcase, Utensils, ShoppingBag, Palette, Heart, Dumbbell, RotateCcw } from 'lucide-react';
import { MCardCustomization } from '@/hooks/useMCardCustomization';
import { Button } from '@/components/ui/button';

export type TemplatePreset = Partial<MCardCustomization>;

interface TemplateSelectorProps {
  onApply: (preset: TemplatePreset) => void;
}

const DEFAULT_PRESET: TemplatePreset = {
  theme: 'default',
  primary_color: '#6366f1',
  secondary_color: '#ec4899',
  custom_font: 'Inter',
  gradients_enabled: true,
  shadows_enabled: true,
  animations_enabled: false,
  particles_enabled: false,
  border_radius: 16,
  card_opacity: 100,
};

const TEMPLATES: Array<{
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  preview: string;
  preset: TemplatePreset;
}> = [
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: Utensils,
    preview: 'bg-gradient-to-br from-orange-500 to-red-600',
    preset: {
      theme: 'creative',
      primary_color: '#ea580c',
      secondary_color: '#dc2626',
      custom_font: 'Playfair Display',
      gradients_enabled: true,
      shadows_enabled: true,
      animations_enabled: true,
      border_radius: 20,
    },
  },
  {
    id: 'boutique',
    name: 'Boutique',
    icon: ShoppingBag,
    preview: 'bg-gradient-to-br from-pink-500 to-purple-600',
    preset: {
      theme: 'elegant',
      primary_color: '#ec4899',
      secondary_color: '#9333ea',
      custom_font: 'Montserrat',
      gradients_enabled: true,
      shadows_enabled: true,
      border_radius: 24,
    },
  },
  {
    id: 'coach',
    name: 'Coach / Fitness',
    icon: Dumbbell,
    preview: 'bg-gradient-to-br from-green-500 to-emerald-600',
    preset: {
      theme: 'nature',
      primary_color: '#10b981',
      secondary_color: '#059669',
      custom_font: 'Poppins',
      animations_enabled: true,
      shadows_enabled: true,
      border_radius: 16,
    },
  },
  {
    id: 'artiste',
    name: 'Artiste',
    icon: Palette,
    preview: 'bg-gradient-to-br from-fuchsia-500 to-indigo-600',
    preset: {
      theme: 'creative',
      primary_color: '#d946ef',
      secondary_color: '#6366f1',
      custom_font: 'Dancing Script',
      animations_enabled: true,
      particles_enabled: true,
      gradients_enabled: true,
      border_radius: 28,
    },
  },
  {
    id: 'pro',
    name: 'Professionnel',
    icon: Briefcase,
    preview: 'bg-gradient-to-br from-slate-700 to-blue-900',
    preset: {
      theme: 'professional',
      primary_color: '#1e3a8a',
      secondary_color: '#0f172a',
      custom_font: 'Inter',
      shadows_enabled: true,
      animations_enabled: false,
      border_radius: 12,
    },
  },
  {
    id: 'wellness',
    name: 'Bien-être',
    icon: Heart,
    preview: 'bg-gradient-to-br from-rose-300 to-amber-300',
    preset: {
      theme: 'default',
      primary_color: '#fda4af',
      secondary_color: '#fcd34d',
      custom_font: 'Lato',
      gradients_enabled: true,
      shadows_enabled: true,
      border_radius: 24,
    },
  },
];

export const TemplateSelector = ({ onApply }: TemplateSelectorProps) => {
  return (
    <div>
      <div className="flex items-start justify-between mb-2 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-600" />
            Modèles par métier
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Appliquez en un clic un style adapté à votre activité.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onApply(DEFAULT_PRESET)}
          className="shrink-0 gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Réinitialiser
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {TEMPLATES.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onApply(tpl.preset)}
              className="group rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all overflow-hidden text-left bg-white"
            >
              <div className={`h-16 ${tpl.preview} flex items-center justify-center`}>
                <Icon className="h-7 w-7 text-white drop-shadow" />
              </div>
              <div className="p-2 text-center">
                <p className="text-sm font-medium">{tpl.name}</p>
                <p className="text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition">
                  Appliquer →
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
