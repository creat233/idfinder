import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Paintbrush, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateColorPickerProps {
  colors: string[];
  onChange: (colors: string[]) => void;
  maxColors?: number;
}

export const TemplateColorPicker = ({ 
  colors, 
  onChange, 
  maxColors = 5 
}: TemplateColorPickerProps) => {
  const [newColor, setNewColor] = useState('#000000');

  const handleAddColor = () => {
    if (colors.length < maxColors) {
      onChange([...colors, newColor]);
    }
  };

  const handleRemoveColor = (index: number) => {
    onChange(colors.filter((_, i) => i !== index));
  };

  const handleColorChange = (index: number, color: string) => {
    const updatedColors = [...colors];
    updatedColors[index] = color;
    onChange(updatedColors);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Paintbrush className="h-5 w-5" />
          Palette de couleurs personnalisée
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Personnalisez jusqu'à {maxColors} couleurs pour votre thème de facture
        </p>

        {/* Liste des couleurs */}
        <div className="space-y-2">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-3">
                <Label className="text-sm font-medium min-w-[80px]">
                  Couleur {index + 1}
                </Label>
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="flex-1 font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveColor(index)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Ajouter une couleur */}
        {colors.length < maxColors && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="h-10 w-20 cursor-pointer"
                />
                <Input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
              <Button
                onClick={handleAddColor}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        )}

        {/* Aperçu des couleurs */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-3">Aperçu de la palette</p>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-16 h-16 rounded-lg border-2 border-border shadow-sm transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {colors.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                Aucune couleur personnalisée
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
