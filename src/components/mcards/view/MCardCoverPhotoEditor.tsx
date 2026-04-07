import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';
import { Camera, X, Upload, ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MCardCoverPhotoEditorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mcardId: string;
  currentCoverUrl?: string | null;
  onCoverUpdated: (newUrl: string | null) => void;
}

export function MCardCoverPhotoEditor({
  isOpen,
  onOpenChange,
  mcardId,
  currentCoverUrl,
  onCoverUpdated
}: MCardCoverPhotoEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentCoverUrl || null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "Max 5 Mo", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      const ext = file.name.split('.').pop();
      const path = `covers/${mcardId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('mcard-assets')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('mcard-assets')
        .getPublicUrl(path);

      const { error: updateError } = await supabase
        .from('mcards')
        .update({ cover_image_url: publicUrl })
        .eq('id', mcardId);

      if (updateError) throw updateError;

      onCoverUpdated(publicUrl);
      toast({
        title: "✅ Photo de couverture mise à jour",
        description: "Votre couverture a été mise à jour avec succès.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la mise à jour de la couverture.",
        variant: "destructive"
      });
      setPreview(currentCoverUrl || null);
    } finally {
      setUploading(false);
    }
  }, [currentCoverUrl, mcardId, onCoverUpdated, onOpenChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'] },
    multiple: false,
  });

  const handleRemoveCover = async () => {
    setUploading(true);
    try {
      const { error } = await supabase
        .from('mcards')
        .update({ cover_image_url: null })
        .eq('id', mcardId);

      if (error) throw error;

      setPreview(null);
      onCoverUpdated(null);
      toast({
        title: "✅ Photo de couverture supprimée",
        description: "Votre photo de couverture a été supprimée.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la suppression de la couverture.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Modifier la photo de couverture
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Zone de prévisualisation et upload */}
          <div {...getRootProps()} className="relative group cursor-pointer">
            <input {...getInputProps()} />

            {preview ? (
              <div className="relative">
                <div className="w-full h-40 rounded-xl overflow-hidden border-2 border-border shadow-lg">
                  <img
                    src={preview}
                    alt="Aperçu couverture"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-xl flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-40 border-4 border-dashed border-muted-foreground/30 rounded-xl flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-colors duration-200">
                {isDragActive ? (
                  <div className="text-center">
                    <Upload className="h-10 w-10 text-primary mx-auto mb-2" />
                    <p className="text-sm text-primary font-medium">Déposez ici</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">Cliquez ou déposez une image</p>
                    <p className="text-xs text-muted-foreground mt-1">pour votre photo de couverture</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center text-xs text-muted-foreground">
            <p>Formats acceptés : JPG, PNG, GIF, WebP</p>
            <p>Taille recommandée : 1200x400 pixels • Max 5 Mo</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {currentCoverUrl && (
              <Button
                onClick={handleRemoveCover}
                variant="outline"
                disabled={uploading}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
            <Button
              onClick={() => onOpenChange(false)}
              variant="secondary"
              disabled={uploading}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>

          {uploading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground mt-2">Mise à jour en cours...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
