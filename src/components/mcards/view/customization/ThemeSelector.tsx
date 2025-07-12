import { Sparkles } from 'lucide-react';
import { MCardCustomization } from '@/hooks/useMCardCustomization';

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

export const ThemeSelector = ({ selectedTheme, onThemeChange }: ThemeSelectorProps) => {
  const themes = [
    { id: 'default', name: 'Classique', color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
    { id: 'modern', name: 'Moderne', color: 'bg-gradient-to-r from-gray-800 to-gray-900' },
    { id: 'elegant', name: 'Élégant', color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
    { id: 'professional', name: 'Professionnel', color: 'bg-gradient-to-r from-blue-600 to-indigo-600' },
    { id: 'creative', name: 'Créatif', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { id: 'nature', name: 'Nature', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-600" />
        Thèmes et couleurs personnalisés
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
            onClick={() => onThemeChange(theme.id)}
          >
            <div className={`w-full h-20 rounded-lg mb-3 ${theme.color}`}></div>
            <p className="text-sm font-medium text-center">{theme.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};