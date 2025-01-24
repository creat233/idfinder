import { useController, UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DocumentTypeFieldProps {
  form: UseFormReturn<any>;
}

export function DocumentTypeField({ form }: DocumentTypeFieldProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: "documentType",
    control: form.control,
    defaultValue: "id",
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="documentType">Type de document</Label>
      <Select
        value={field.value}
        onValueChange={field.onChange}
        defaultValue="id"
      >
        <SelectTrigger 
          id="documentType"
          className={`w-full bg-white ${error ? "border-destructive" : "border-input"}`}
        >
          <SelectValue placeholder="Sélectionnez le type de document" />
        </SelectTrigger>
        <SelectContent 
          position="popper" 
          className="bg-white border border-gray-200 shadow-lg z-50"
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