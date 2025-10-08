import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Check } from 'lucide-react';
import { InvoiceTemplate, invoiceTemplates } from '@/types/invoiceTemplate';
import { TemplateColorPicker } from './TemplateColorPicker';

interface InvoiceTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  customColors?: string[];
  onCustomColorsChange?: (colors: string[]) => void;
}

export const InvoiceTemplateSelector = ({ 
  selectedTemplate, 
  onTemplateSelect,
  customColors = [],
  onCustomColorsChange
}: InvoiceTemplateSelectorProps) => {
  const [localColors, setLocalColors] = useState<string[]>(customColors);

  useEffect(() => {
    setLocalColors(customColors);
  }, [customColors]);

  const handleColorsChange = (colors: string[]) => {
    setLocalColors(colors);
    onCustomColorsChange?.(colors);
  };

  return (
    <div className="space-y-6 mb-24">
      {/* Sélecteur de couleurs personnalisées */}
      {onCustomColorsChange && (
        <TemplateColorPicker 
          colors={localColors}
          onChange={handleColorsChange}
          maxColors={5}
        />
      )}

      {/* Modèles de factures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Modèles de factures
          </CardTitle>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoiceTemplates.map((template) => (
            <div
              key={template.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
              
              <div className="space-y-3">
                {/* Aperçu du template */}
                <div 
                  className="h-24 rounded border-2 flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: template.styles.backgroundColor,
                    borderColor: template.styles.borderColor,
                    color: template.styles.textColor
                  }}
                >
                  <div className="text-center space-y-1">
                    <div 
                      className="font-bold"
                      style={{ color: template.styles.primaryColor }}
                    >
                      FACTURE #001
                    </div>
                    <div className="text-xs opacity-60">Aperçu</div>
                  </div>
                </div>
                
                {/* Informations du template */}
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                
                {/* Caractéristiques */}
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {template.styles.headerStyle}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {template.styles.layout}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 Chaque modèle peut être personnalisé avec vos couleurs personnalisées. 
            Le modèle sélectionné s'appliquera à toutes vos nouvelles factures.
          </p>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};