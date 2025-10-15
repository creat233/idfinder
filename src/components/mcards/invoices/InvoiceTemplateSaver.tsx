import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface InvoiceTemplateSaverProps {
  colors: string[];
  onSave?: (templateName: string, templateDescription: string, colors: string[]) => void;
}

export const InvoiceTemplateSaver = ({ colors, onSave }: InvoiceTemplateSaverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    if (!templateName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer un nom pour le modèle"
      });
      return;
    }

    if (colors.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez ajouter au moins une couleur"
      });
      return;
    }

    // Sauvegarder le modèle (localement pour l'instant)
    const template = {
      id: `custom-${Date.now()}`,
      name: templateName,
      description: templateDescription || 'Modèle personnalisé',
      colors: colors,
      createdAt: new Date().toISOString()
    };

    // Récupérer les modèles existants du localStorage
    const existingTemplates = JSON.parse(localStorage.getItem('customInvoiceTemplates') || '[]');
    existingTemplates.push(template);
    localStorage.setItem('customInvoiceTemplates', JSON.stringify(existingTemplates));

    toast({
      title: "Succès",
      description: `Modèle "${templateName}" sauvegardé avec succès`
    });

    if (onSave) {
      onSave(templateName, templateDescription, colors);
    }

    // Réinitialiser le formulaire et fermer
    setTemplateName('');
    setTemplateDescription('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          disabled={colors.length === 0}
        >
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder comme nouveau modèle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau modèle de facture</DialogTitle>
          <DialogDescription>
            Sauvegardez votre palette de couleurs comme nouveau modèle de facture
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Nom du modèle</Label>
            <Input
              id="template-name"
              placeholder="Ex: Moderne Violet"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-description">Description (optionnel)</Label>
            <Textarea
              id="template-description"
              placeholder="Décrivez votre modèle..."
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Aperçu de la palette ({colors.length} couleurs)</Label>
            <div className="flex gap-2 p-4 bg-muted rounded-lg">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 h-16 rounded-md border-2 border-border shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
