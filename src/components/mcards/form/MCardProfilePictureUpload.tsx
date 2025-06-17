
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, X } from 'lucide-react';
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
    <div className="space-y-2">
      <Label>{t('profilePhoto')}</Label>
      <div {...getRootProps()} className="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative group w-24 h-24 mx-auto">
            <Avatar className="w-24 h-24">
              <AvatarImage src={preview} alt="Aperçu" className="object-cover" />
              <AvatarFallback><ImageIcon className="h-8 w-8 text-muted-foreground" /></AvatarFallback>
            </Avatar>
            <Button 
              variant="destructive" size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemoveImage}
              title={t('removeImage')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-24">
            <ImageIcon className="h-8 w-8" />
            {isDragActive ? <p>{t('dropImageActive')}</p> : <p className="text-sm">{t('dropImage')}</p>}
          </div>
        )}
      </div>
    </div>
  );
};
