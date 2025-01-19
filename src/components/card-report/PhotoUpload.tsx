import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface PhotoUploadProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhotoUpload = ({ file, onFileChange }: PhotoUploadProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Photo de la carte (optionnel)</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
          id="photo-upload"
        />
        <label htmlFor="photo-upload" className="cursor-pointer">
          <Button 
            variant="outline" 
            className="w-full"
            type="button"
          >
            <Upload className="mr-2 h-4 w-4" />
            {file ? file.name : "Ajouter une photo"}
          </Button>
        </label>
        <p className="mt-2 text-sm text-gray-500">PNG, JPG jusqu'à 5MB</p>
      </div>
    </div>
  );
};