
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, X, Upload, Camera } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";

interface MCardProfilePictureUploadProps {
  preview: string | null;
  onFileChange: (file: File | null) => void;
  onPreviewChange: (preview: string | null) => void;
}

export const MCardProfilePictureUpload = ({ preview, onFileChange, onPreviewChange }: MCardProfilePictureUploadProps) => {
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileChange(file);
      const objectUrl = URL.createObjectURL(file);
      onPreviewChange(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [onFileChange, onPreviewChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'] },
    multiple: false,
  });

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    onPreviewChange(null);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Label className="text-lg font-semibold text-gray-700">Photo de profil</Label>
        <p className="text-sm text-gray-500 mt-1">Ajoutez une photo pour personnaliser votre carte</p>
      </div>
      
      <div className="flex justify-center">
        <div {...getRootProps()} className="relative group cursor-pointer">
          <input {...getInputProps()} />
          
          {preview ? (
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={preview} alt="Aperçu" className="object-cover" />
                <AvatarFallback>
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              
              {/* Overlay avec boutons */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-full flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="rounded-full bg-white text-gray-700 hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="rounded-full"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">Cliquez ou</p>
                  <p className="text-xs text-gray-500">déposez une image</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-500">
        <p>Formats acceptés : JPG, PNG, GIF, WebP</p>
        <p>Taille maximum : 5MB</p>
      </div>
    </div>
  );
};
