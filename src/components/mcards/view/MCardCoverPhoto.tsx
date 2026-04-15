import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MCard } from '@/types/mcard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { deleteCoverPhoto, uploadCoverPhoto } from '@/services/mcardCoverPhotoService';

interface MCardCoverPhotoProps {
  mcard: MCard;
  isOwner: boolean;
  onUpdate?: () => void;
}

export const MCardCoverPhoto = ({ mcard, isOwner, onUpdate }: MCardCoverPhotoProps) => {
  const [coverUrl, setCoverUrl] = useState(mcard.cover_image_url);
  const [uploading, setUploading] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCoverUrl(mcard.cover_image_url);
  }, [mcard.cover_image_url]);

  const defaultGradient = 'bg-gradient-to-r from-primary via-primary/70 to-accent';

  const handleCoverUpdated = (newUrl: string | null) => {
    setCoverUrl(newUrl);
    onUpdate?.();
  };

  const handleOpenPicker = () => {
    if (uploading) return;
    inputRef.current?.click();
  };

  const handleUploadCover = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'La photo de couverture doit faire moins de 5 Mo.',
        variant: 'destructive'
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Format invalide',
        description: 'Veuillez sélectionner une image valide.',
        variant: 'destructive'
      });
      return;
    }

    const previousCoverUrl = coverUrl;
    const objectUrl = URL.createObjectURL(file);

    setCoverUrl(objectUrl);
    setUploading(true);

    try {
      const publicUrl = await uploadCoverPhoto(file, mcard.id);

      const { error } = await supabase
        .from('mcards')
        .update({ cover_image_url: publicUrl })
        .eq('id', mcard.id);

      if (error) throw error;

      if (previousCoverUrl?.startsWith('http')) {
        await deleteCoverPhoto(previousCoverUrl);
      }

      handleCoverUpdated(publicUrl);
      toast({
        title: '✅ Photo de couverture mise à jour',
        description: 'Votre couverture a bien été ajoutée.'
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload de la couverture:', error);
      setCoverUrl(previousCoverUrl);
      toast({
        title: '❌ Erreur',
        description: 'Impossible d’ajouter la photo de couverture.',
        variant: 'destructive'
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      setUploading(false);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    void handleUploadCover(file);
  };

  const handleRemoveCover = async () => {
    if (!coverUrl || uploading) return;

    setUploading(true);
    try {
      if (coverUrl.startsWith('http')) {
        await deleteCoverPhoto(coverUrl);
      }

      const { error } = await supabase
        .from('mcards')
        .update({ cover_image_url: null })
        .eq('id', mcard.id);

      if (error) throw error;

      handleCoverUpdated(null);
      toast({
        title: '✅ Photo de couverture supprimée',
        description: 'Votre couverture a été supprimée.'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la couverture:', error);
      toast({
        title: '❌ Erreur',
        description: 'Impossible de supprimer la photo de couverture.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleInputChange}
      />

      <div
        className="relative w-full h-32 sm:h-40 md:h-48 rounded-t-2xl overflow-hidden"
        onClick={() => {
          if (coverUrl && !uploading) {
            setIsViewerOpen(true);
          }
        }}
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`Couverture de ${mcard.full_name}`}
            className="w-full h-full object-cover cursor-pointer"
          />
        ) : (
          <div className={`w-full h-full ${defaultGradient}`} />
        )}

        {/* Overlay gradient for text readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[1px]">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Envoi...
            </div>
          </div>
        )}

        {isOwner && (
          <div className="absolute bottom-2 right-2 flex gap-1.5">
            <Button
              size="sm"
              variant="secondary"
              type="button"
              className="cursor-pointer bg-background/90 hover:bg-background text-xs h-7 px-2 shadow-sm"
              onClick={handleOpenPicker}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Camera className="h-3 w-3 mr-1" />
              )}
              {uploading ? 'Envoi...' : 'Couverture'}
            </Button>
            {coverUrl && (
              <Button
                size="sm"
                variant="secondary"
                type="button"
                className="bg-background/90 hover:bg-background text-xs h-7 w-7 p-0 shadow-sm"
                onClick={handleRemoveCover}
                disabled={uploading}
                aria-label="Supprimer la photo de couverture"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Dialog pour voir la couverture en grand */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-3xl w-[95vw] p-2 sm:p-4">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              Photo de couverture
            </DialogTitle>
          </DialogHeader>
          {coverUrl && (
            <div className="flex flex-col items-center gap-4">
              <img
                src={coverUrl}
                alt={`Couverture de ${mcard.full_name}`}
                className="w-full max-h-[70vh] rounded-xl object-contain"
              />
              <button
                type="button"
                onClick={() => window.open(coverUrl, '_blank')}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Voir en taille réelle
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
