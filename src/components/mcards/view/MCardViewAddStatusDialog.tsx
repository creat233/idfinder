
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Palette } from 'lucide-react';

interface MCardViewAddStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mcardId: string;
  onStatusAdded: () => void;
}

const STATUS_COLORS = [
  '#22C55E', // Vert
  '#EF4444', // Rouge
  '#F59E0B', // Orange
  '#3B82F6', // Bleu
  '#8B5CF6', // Violet
  '#EC4899', // Rose
  '#6B7280', // Gris
];

export const MCardViewAddStatusDialog = ({ 
  isOpen, 
  onClose, 
  mcardId, 
  onStatusAdded 
}: MCardViewAddStatusDialogProps) => {
  const [statusText, setStatusText] = useState('');
  const [statusColor, setStatusColor] = useState('#22C55E');
  const [statusImage, setStatusImage] = useState<File | null>(null);
  const [statusImageUrl, setStatusImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const uploadStatusImage = async (file: File): Promise<string | null> => {
    const fileName = `${mcardId}-${Date.now()}.${file.name.split('.').pop()}`;
    const filePath = `status-images/${fileName}`;

    const { error } = await supabase.storage
      .from('mcard-profile-pictures')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading status image:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('mcard-profile-pictures')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!statusText.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le texte du statut est requis"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = statusImageUrl;
      
      if (statusImage) {
        const uploadedUrl = await uploadStatusImage(statusImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const { error } = await supabase
        .from('mcard_statuses')
        .insert({
          mcard_id: mcardId,
          status_text: statusText.trim(),
          status_color: statusColor,
          status_image: imageUrl || null,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
        });

      if (error) throw error;

      toast({
        title: "Statut ajouté !",
        description: "Votre statut a été publié avec succès"
      });

      onStatusAdded();
      onClose();
      
      // Reset form
      setStatusText('');
      setStatusColor('#22C55E');
      setStatusImage(null);
      setStatusImageUrl('');
    } catch (error: any) {
      console.error('Error adding status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le statut"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStatusImage(e.target.files[0]);
      setStatusImageUrl('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un statut</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="statusText">Texte du statut *</Label>
            <Input
              id="statusText"
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              placeholder="Ex: Disponible, Occupé, En pause..."
              maxLength={50}
            />
          </div>

          <div>
            <Label>Couleur du statut</Label>
            <div className="flex gap-2 mt-2">
              {STATUS_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    statusColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setStatusColor(color)}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="statusImage">Image (optionnel)</Label>
            <div className="mt-2">
              <Input
                id="statusImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {statusImageUrl && (
                <div className="text-sm text-gray-600">
                  Ou URL de l'image:
                  <Input
                    value={statusImageUrl}
                    onChange={(e) => setStatusImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ajout...' : 'Ajouter le statut'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
