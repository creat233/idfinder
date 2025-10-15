import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Check, Trash2 } from 'lucide-react';
import { InvoiceTemplate, invoiceTemplates } from '@/types/invoiceTemplate';
import { TemplateColorPicker } from './TemplateColorPicker';

interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  colors: string[];
  createdAt: string;
}

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
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);

  // Charger les modèles personnalisés depuis le localStorage
  useEffect(() => {
    loadCustomTemplates();
    
    // Écouter les changements dans le localStorage
    const handleStorageChange = () => {
      loadCustomTemplates();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Écouter aussi les événements personnalisés pour les changements dans le même onglet
    window.addEventListener('customTemplatesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customTemplatesUpdated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    setLocalColors(customColors);
  }, [customColors]);

  const loadCustomTemplates = () => {
    const templates = JSON.parse(localStorage.getItem('customInvoiceTemplates') || '[]');
    setCustomTemplates(templates);
  };

  const handleDeleteCustomTemplate = (templateId: string) => {
    const templates = customTemplates.filter(t => t.id !== templateId);
    localStorage.setItem('customInvoiceTemplates', JSON.stringify(templates));
    setCustomTemplates(templates);
    
    // Si le modèle supprimé était sélectionné, revenir au modèle par défaut
    if (selectedTemplate === templateId) {
      onTemplateSelect('modern');
    }
  };

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

      {/* Modèles personnalisés */}
      {customTemplates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Mes modèles personnalisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id 
                      ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/50' 
                      : 'border-border hover:border-purple-400'
                  }`}
                  onClick={() => onTemplateSelect(template.id)}
                >
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {/* Aperçu de la palette */}
                    <div className="h-24 rounded border-2 border-border flex items-center justify-center overflow-hidden">
                      <div className="flex h-full w-full">
                        {template.colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex-1 h-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Informations du template */}
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        {template.colors.length} couleurs
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomTemplate(template.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modèles de factures par défaut */}
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