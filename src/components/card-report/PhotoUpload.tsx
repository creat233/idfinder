import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PhotoUploadProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhotoUpload = ({ file, onFileChange }: PhotoUploadProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndHandleFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndHandleFile(selectedFile);
    }
  };

  const validateAndHandleFile = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Type de fichier non supporté",
        description: "Veuillez sélectionner une image au format JPG ou PNG",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille du fichier ne doit pas dépasser 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Create a synthetic event to match the expected type
      const syntheticEvent = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onFileChange(syntheticEvent);

      toast({
        title: "Photo sélectionnée",
        description: "La photo sera téléchargée lors de la soumission du formulaire",
      });
    } catch (error) {
      console.error('Error handling file:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sélection du fichier",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Photo de la carte (facultatif)</label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${file ? 'bg-gray-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          id="photo-upload"
          disabled={isUploading}
        />
        <label htmlFor="photo-upload" className="cursor-pointer">
          <Button 
            variant="outline" 
            className="w-full"
            type="button"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Chargement...
              </>
            ) : file ? (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                {file.name}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Ajouter une photo
              </>
            )}
          </Button>
        </label>
        {!file && !isUploading && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Glissez et déposez une image ici ou cliquez pour sélectionner
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG jusqu'à 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};