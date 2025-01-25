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
          className={`w-full bg-white border ${error ? "border-destructive" : "border-input hover:border-primary"} rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        >
          <SelectValue placeholder="Sélectionnez le type de document" />
        </SelectTrigger>
        <SelectContent
          align="start"
          side="bottom"
          position="popper"
          className="bg-white border border-gray-200 rounded-lg shadow-lg min-w-[240px] p-1 z-50"
        >
          <SelectItem value="id" className="cursor-pointer rounded-md px-3 py-2 text-base hover:bg-gray-100">
            Carte d'identité
          </SelectItem>
          <SelectItem value="driver_license" className="cursor-pointer rounded-md px-3 py-2 text-base hover:bg-gray-100">
            Permis de conduire
          </SelectItem>
          <SelectItem value="passport" className="cursor-pointer rounded-md px-3 py-2 text-base hover:bg-gray-100">
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