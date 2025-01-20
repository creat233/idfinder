import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PhotoUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export const PhotoUpload = ({ file, onFileChange }: PhotoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Type de fichier non supporté",
        description: "Veuillez sélectionner une image au format JPG ou PNG."
      });
      return false;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "Fichier trop volumineux",
        description: "La taille du fichier ne doit pas dépasser 5MB."
      });
      return false;
    }

    return true;
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      await handleFileUpload(droppedFile);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      await handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      onFileChange(file);
      
      toast({
        title: "Photo ajoutée avec succès",
        description: "La photo a été ajoutée à votre signalement."
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        variant: "destructive",
        title: "Erreur lors du téléchargement",
        description: "Une erreur est survenue lors de l'ajout de la photo. Veuillez réessayer."
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
        {isUploading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-gray-500">Téléchargement en cours...</p>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center justify-center">
            <ImageIcon className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={() => onFileChange(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-700"
            >
              Supprimer
            </button>
          </div>
        ) : (
          <>
            <label className="cursor-pointer flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Ajouter une photo
              </span>
            </label>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Glissez et déposez une image ici ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG ou PNG jusqu'à 5MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};