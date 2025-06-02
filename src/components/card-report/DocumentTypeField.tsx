
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
          className="bg-white border border-gray-200 rounded-lg shadow-lg min-w-[240px] p-1"
          position="popper"
          sideOffset={5}
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
          <SelectItem value="student_card" className="cursor-pointer rounded-md px-3 py-2 text-base hover:bg-gray-100 text-green-600 font-medium">
            Carte étudiante (Gratuit - Contact direct)
          </SelectItem>
        </SelectContent>
      </Select>
      {field.value === "student_card" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
          <p className="text-sm text-green-700">
            <strong>Carte étudiante - Service gratuit :</strong> Votre numéro de téléphone sera affiché directement pour permettre à l'étudiant de vous contacter immédiatement.
          </p>
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}
