import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDropzone } from 'react-dropzone';
import { Camera, X, Upload } from 'lucide-react';
import { uploadProfilePicture, deleteProfilePicture } from '@/services/mcardProfileService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MCardProfileEditorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mcardId: string;
  currentImageUrl?: string | null;
  onImageUpdated: (newUrl: string | null) => void;
}

export function MCardProfileEditor({ 
  isOpen, 
  onOpenChange, 
  mcardId, 
  currentImageUrl, 
  onImageUpdated 
}: MCardProfileEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      // Créer un aperçu
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Obtenir l'ID utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Supprimer l'ancienne image si elle existe
      if (currentImageUrl) {
        await deleteProfilePicture(currentImageUrl);
      }

      // Uploader la nouvelle image
      const newImageUrl = await uploadProfilePicture(file, user.id);
      
      if (newImageUrl) {
        // Mettre à jour la MCard
        const { error } = await supabase
          .from('mcards')
          .update({ profile_picture_url: newImageUrl })
          .eq('id', mcardId);

        if (error) throw error;

        onImageUpdated(newImageUrl);
        toast({
          title: "✅ Photo mise à jour",
          description: "Votre photo de profil a été mise à jour avec succès.",
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la mise à jour de la photo.",
        variant: "destructive"
      });
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  }, [currentImageUrl, mcardId, onImageUpdated, onOpenChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'] },
    multiple: false,
  });

  const handleRemoveImage = async () => {
    setUploading(true);
    try {
      if (currentImageUrl) {
        await deleteProfilePicture(currentImageUrl);
      }

      const { error } = await supabase
        .from('mcards')
        .update({ profile_picture_url: null })
        .eq('id', mcardId);

      if (error) throw error;

      setPreview(null);
      onImageUpdated(null);
      toast({
        title: "✅ Photo supprimée",
        description: "Votre photo de profil a été supprimée.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "❌ Erreur",
        description: "Erreur lors de la suppression de la photo.",
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
            <Camera className="h-5 w-5" />
            Modifier la photo de profil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Zone de prévisualisation et upload */}
          <div className="flex justify-center">
            <div {...getRootProps()} className="relative group cursor-pointer">
              <input {...getInputProps()} />
              
              {preview ? (
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img 
                      src={preview} 
                      alt="Aperçu" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-full flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 border-4 border-dashed border-gray-300 rounded-full flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200">
                  {isDragActive ? (
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-blue-600 font-medium">Déposez ici</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 font-medium">Cliquez ou</p>
                      <p className="text-xs text-gray-500">déposez une image</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center text-xs text-gray-500">
            <p>Formats acceptés : JPG, PNG, GIF, WebP</p>
            <p>Taille recommandée : 400x400 pixels</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {currentImageUrl && (
              <Button 
                onClick={handleRemoveImage}
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
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600 mt-2">Mise à jour en cours...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}