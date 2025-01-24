import { useController, UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface DocumentTypeFieldProps {
  form: UseFormReturn<any>;
}

export function DocumentTypeField({ form }: DocumentTypeFieldProps) {
  const [mounted, setMounted] = useState(false);
  const {
    field,
    fieldState: { error },
  } = useController({
    name: "documentType",
    control: form.control,
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

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
          ref={(ref) => {
            if (ref) {
              ref.style.zIndex = "50";
            }
          }}
          position="popper"
          className="bg-white border border-gray-200 shadow-lg"
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