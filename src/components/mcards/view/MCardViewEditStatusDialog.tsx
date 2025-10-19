import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MCardStatus } from '@/types/mcard';

interface MCardViewEditStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  status: MCardStatus | null;
  onStatusUpdated: () => void;
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

export const MCardViewEditStatusDialog = ({ 
  isOpen, 
  onClose, 
  status,
  onStatusUpdated 
}: MCardViewEditStatusDialogProps) => {
  const [statusText, setStatusText] = useState('');
  const [statusColor, setStatusColor] = useState('#22C55E');
  const [statusImage, setStatusImage] = useState<File | null>(null);
  const [statusImageUrl, setStatusImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (status) {
      setStatusText(status.status_text);
      setStatusColor(status.status_color);
      setStatusImageUrl(status.status_image || '');
    }
  }, [status]);

  const uploadStatusImage = async (file: File): Promise<string | null> => {
    if (!status) return null;
    
    const fileName = `${status.mcard_id}-${Date.now()}.${file.name.split('.').pop()}`;
    const filePath = `status-images/${fileName}`;

    const { error } = await supabase.storage
      .from('status-images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading status image:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('status-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!statusText.trim() || !status) {
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
        .update({
          status_text: statusText.trim(),
          status_color: statusColor,
          status_image: imageUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', status.id);

      if (error) throw error;

      toast({
        title: "Statut modifié !",
        description: "Votre statut a été mis à jour avec succès"
      });

      onStatusUpdated();
      onClose();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le statut"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!status) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce statut ?')) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Set status to inactive instead of deleting
      const { error } = await supabase
        .from('mcard_statuses')
        .update({ is_active: false })
        .eq('id', status.id);

      if (error) throw error;

      toast({
        title: "Statut supprimé !",
        description: "Le statut a été désactivé avec succès"
      });

      onStatusUpdated();
      onClose();
    } catch (error: any) {
      console.error('Error deleting status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le statut"
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

  if (!status) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le statut</DialogTitle>
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
              <Input
                value={statusImageUrl}
                onChange={(e) => setStatusImageUrl(e.target.value)}
                placeholder="Ou URL de l'image..."
                className="mt-1"
              />
              {statusImageUrl && (
                <img 
                  src={statusImageUrl} 
                  alt="Aperçu" 
                  className="mt-2 w-20 h-20 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Supprimer
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Modification...' : 'Modifier'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};