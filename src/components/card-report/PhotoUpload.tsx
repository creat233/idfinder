import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/hooks/useTranslation";

export interface PhotoUploadProps {
  form: UseFormReturn<any>;
}

export function PhotoUpload({ form }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const currentFile = form.watch("photoUrl");
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `card_photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('card_photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('card_photos')
        .getPublicUrl(filePath);

      form.setValue("photoUrl", publicUrl, { shouldValidate: true });
      
      showSuccess(t("photoUploadSuccessTitle"), t("photoUploadSuccessDesc"));
    } catch (error) {
      console.error("Error uploading file:", error);
      showError(t("photoUploadErrorTitle"), t("photoUploadErrorUpload"));
    } finally {
      setIsUploading(false);
    }
  }, [form, showSuccess, showError, t]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 5 * 1024 * 1024) {
        showError(t("photoUploadErrorTitle"), t("photoUploadErrorSize"));
        return;
      }
      handleFileUpload(file);
    }
  }, [handleFileUpload, showError, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
  });

  const handleRemoveFile = () => {
    form.setValue("photoUrl", "", { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary",
          currentFile ? "bg-gray-50" : ""
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          ) : currentFile ? (
            <div className="flex items-center space-x-2">
              <img 
                src={currentFile} 
                alt="Aperçu" 
                className="h-20 w-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  {t("photoUploadTitle")}
                </p>
                <p className="text-xs text-gray-500">
                  {t("photoUploadDesc")}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
