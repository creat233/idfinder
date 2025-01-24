import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

interface PhotoUploadProps {
  form: UseFormReturn<any>;
}

export const PhotoUpload = ({ form }: PhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const currentFile = form.watch("photoUrl") ? new File([], form.watch("photoUrl")) : null;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (validateFile(file)) {
        handleFileUpload(file);
      }
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Type de fichier non supporté",
        description: "Veuillez sélectionner une image au format JPG ou PNG",
      });
      return false;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "Fichier trop volumineux",
        description: "La taille du fichier ne doit pas dépasser 5MB",
      });
      return false;
    }

    return true;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      form.setValue("photoUrl", file.name, { shouldValidate: true });
      
      toast({
        title: "Photo ajoutée avec succès",
        description: "La photo a été ajoutée à votre signalement",
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        variant: "destructive",
        title: "Erreur lors du téléchargement",
        description: "Une erreur est survenue lors du téléchargement de la photo",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    form.setValue("photoUrl", "", { shouldValidate: true });
  };

  return (
    <div className="w-full space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Photo de la carte (facultatif)
      </label>
      
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
          "flex flex-col items-center justify-center text-center"
        )}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500">Téléchargement en cours...</p>
          </div>
        ) : currentFile ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{currentFile.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Glissez et déposez votre photo ici, ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-400">
                JPG ou PNG jusqu'à 5MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};