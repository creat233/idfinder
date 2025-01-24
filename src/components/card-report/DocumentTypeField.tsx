import { useController, UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef } from "react";

interface DocumentTypeFieldProps {
  form: UseFormReturn<any>;
}

export function DocumentTypeField({ form }: DocumentTypeFieldProps) {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const {
    field,
    fieldState: { error },
  } = useController({
    name: "documentType",
    control: form.control,
  });

  useEffect(() => {
    // Create portal container if it doesn't exist
    if (!portalRef.current) {
      portalRef.current = document.createElement('div');
      portalRef.current.id = 'select-portal';
      document.body.appendChild(portalRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (portalRef.current && document.body.contains(portalRef.current)) {
        document.body.removeChild(portalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Type de document
      </label>
      <Select
        value={field.value}
        onValueChange={field.onChange}
        defaultValue="id"
      >
        <SelectTrigger className="w-full bg-white border-gray-200 hover:bg-gray-50">
          <SelectValue placeholder="Sélectionnez le type de document" />
        </SelectTrigger>
        <SelectContent 
          className="bg-white border border-gray-200 shadow-lg"
          container={portalRef.current}
        >
          <SelectItem value="id" className="cursor-pointer hover:bg-gray-100">
            Carte d'identité
          </SelectItem>
          <SelectItem value="driver_license" className="cursor-pointer hover:bg-gray-100">
            Permis de conduire
          </SelectItem>
          <SelectItem value="passport" className="cursor-pointer hover:bg-gray-100">
            Passeport
          </SelectItem>
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}