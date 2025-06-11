
import { useController, UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";

interface DocumentTypeFieldProps {
  form: UseFormReturn<any>;
}

export function DocumentTypeField({ form }: DocumentTypeFieldProps) {
  const { t } = useTranslation();
  const {
    field,
    fieldState: { error },
  } = useController({
    name: "documentType",
    control: form.control,
    defaultValue: "id",
  });

  const documentTypes = [
    { value: "id", label: "Carte d'identité nationale" },
    { value: "driver_license", label: "Permis de conduire" },
    { value: "passport", label: "Passeport" },
    { value: "vehicle_registration", label: "Carte grise véhicule" },
    { value: "motorcycle_registration", label: "Carte grise moto" },
    { value: "residence_permit", label: "Carte de séjour" },
    { value: "student_card", label: "Carte étudiante (Gratuit - Contact direct)" },
    { value: "health_card", label: "Carte de santé (Gratuit - Contact direct)" },
  ];

  const isFreeService = field.value === "student_card" || field.value === "health_card";

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
          className={`w-full ${error ? "border-destructive" : ""}`}
        >
          <SelectValue placeholder="Sélectionnez le type de document" />
        </SelectTrigger>
        <SelectContent>
          {documentTypes.map((docType) => (
            <SelectItem 
              key={docType.value} 
              value={docType.value} 
              className={
                (docType.value === "student_card" || docType.value === "health_card") ? "text-green-600 font-medium" : ""
              }
            >
              {docType.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {isFreeService && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
          <p className="text-sm text-green-700">
            <strong>
              {field.value === "student_card" ? "Carte étudiante" : "Carte de santé"} - Service gratuit :
            </strong> Votre numéro de téléphone sera affiché directement pour permettre au propriétaire de vous contacter immédiatement.
          </p>
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
        <div className="flex items-start gap-2">
          <span className="text-lg">📦</span>
          <div>
            <p className="text-sm text-blue-700 font-medium">
              Option de livraison à domicile
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Pour tous les types de documents, nous proposons un service de livraison à domicile
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Coût de livraison : 2000 FCFA (négociable selon la distance)
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}
