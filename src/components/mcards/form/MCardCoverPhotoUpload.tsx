import { ChangeEvent, useRef } from 'react';
import { ImagePlus, Images, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface MCardCoverPhotoUploadProps {
  preview: string | null;
  onFileChange: (file: File | null) => void;
  onPreviewChange: (preview: string | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const MCardCoverPhotoUpload = ({
  preview,
  onFileChange,
  onPreviewChange,
}: MCardCoverPhotoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleOpenPicker = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Format invalide',
        description: 'Veuillez sélectionner une image valide.',
        variant: 'destructive'
      });
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'La photo de couverture doit faire moins de 5 Mo.',
        variant: 'destructive'
      });
      event.target.value = '';
      return;
    }

    onFileChange(file);
    onPreviewChange(URL.createObjectURL(file));
    event.target.value = '';
  };

  const handleRemoveImage = () => {
    onFileChange(null);
    onPreviewChange(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Label className="text-lg font-semibold text-foreground">Couverture</Label>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajoutez une photo de couverture pour personnaliser votre mCard
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleInputChange}
      />

      <div className="relative">
        <button
          type="button"
          onClick={handleOpenPicker}
          className="group relative block w-full overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/30 text-left transition-colors hover:border-primary/50 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {preview ? (
            <img
              src={preview}
              alt="Aperçu de la photo de couverture"
              className="h-40 w-full object-cover sm:h-48"
              loading="lazy"
            />
          ) : (
            <div className="flex h-40 flex-col items-center justify-center gap-3 px-6 text-center sm:h-48">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
                <Images className="h-7 w-7 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground sm:text-base">
                  Cliquez pour ajouter votre couverture
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Choisissez une image large qui représentera votre activité
                </p>
              </div>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-background/95 via-background/70 to-transparent px-4 py-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
              <ImagePlus className="h-3.5 w-3.5" />
              {preview ? 'Modifier la couverture' : 'Ajouter une couverture'}
            </div>
            <span className="text-[11px] text-muted-foreground sm:text-xs">
              JPG, PNG, GIF, WebP
            </span>
          </div>
        </button>

        {preview && (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-3 top-3 h-8 w-8 rounded-full bg-background/90 shadow-sm"
            onClick={handleRemoveImage}
            aria-label="Supprimer la photo de couverture"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Formats acceptés : JPG, PNG, GIF, WebP
      </p>
    </div>
  );
};