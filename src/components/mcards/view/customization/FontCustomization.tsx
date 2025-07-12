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
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      <h4 className="font-medium text-gray-900 flex items-center gap-2">
        <Type className="h-5 w-5 text-indigo-600" />
        Police personnalisée
      </h4>
      
      <div>
        <Label>Famille de police</Label>
        <Select 
          value={selectedFont} 
          onValueChange={onFontChange}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Choisir une police" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map(font => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: selectedFont }}>
          Aperçu avec la police sélectionnée: {selectedFont}
        </div>
      </div>
    </div>
  );
};