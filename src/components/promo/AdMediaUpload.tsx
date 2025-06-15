
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";

interface AdMediaUploadProps {
  value: string | null | undefined;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export function AdMediaUpload({ value, onChange, onRemove }: AdMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { showSuccess, showError } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 25 * 1024 * 1024) { // 25MB limit
        showError("Erreur", "La taille du fichier ne doit pas dépasser 25 Mo");
        return;
      }
      handleFileUpload(file);
    }
  }, [showError, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
    },
    maxFiles: 1,
  });

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('admin_ads_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('admin_ads_media')
        .getPublicUrl(filePath);

      onChange(publicUrl);
      
      showSuccess("Média ajouté avec succès", "Votre fichier a été téléchargé");
    } catch (error: any) {
      console.error("Error uploading file:", error);
      showError("Erreur", error.message || "Une erreur est survenue lors du téléchargement du fichier");
    } finally {
      setIsUploading(false);
    }
  };
  
  const isVideo = value?.match(/\.(mp4|webm)$/i);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary",
        value ? "border-solid bg-gray-50" : ""
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        {isUploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="text-sm text-gray-500">Téléchargement...</p>
          </>
        ) : value ? (
          <div className="relative group">
            {isVideo ? (
                <video src={value} className="h-24 w-auto object-cover rounded" muted loop autoPlay playsInline />
            ) : (
                <img src={value} alt="Aperçu" className="h-24 w-auto object-cover rounded" />
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Glissez-déposez un fichier ici, ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-500">
                Image ou Vidéo (max. 25 Mo)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
