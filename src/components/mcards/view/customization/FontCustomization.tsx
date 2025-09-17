import { Type } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface FontCustomizationProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

export const FontCustomization = ({ selectedFont, onFontChange }: FontCustomizationProps) => {
  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 
    'Playfair Display', 'Merriweather', 'Dancing Script', 'Pacifico'
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Type className="h-5 w-5 text-green-600" />
        Typographie personnalisée
      </h3>
      
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Police de caractères</Label>
          <Select value={selectedFont} onValueChange={onFontChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir une police" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem 
                  key={font} 
                  value={font}
                  style={{ fontFamily: font }}
                >
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            La police sera appliquée à tous les textes de votre carte
          </p>
        </div>

        <div className="p-3 bg-white rounded border">
          <p className="text-sm" style={{ fontFamily: selectedFont }}>
            Aperçu : Voici comment apparaîtra le texte avec la police {selectedFont}
          </p>
        </div>
      </div>
    </div>
  );
};