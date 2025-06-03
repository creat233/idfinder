
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
    { value: "id", label: t("documentTypes.id") },
    { value: "driver_license", label: t("documentTypes.driver_license") },
    { value: "passport", label: t("documentTypes.passport") },
    { value: "vehicle_registration", label: t("documentTypes.vehicle_registration") },
    { value: "motorcycle_registration", label: t("documentTypes.motorcycle_registration") },
    { value: "residence_permit", label: t("documentTypes.residence_permit") },
    { value: "student_card", label: t("documentTypes.student_card") + " (Gratuit - Contact direct)" },
  ];

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
          {documentTypes.map((docType) => (
            <SelectItem 
              key={docType.value} 
              value={docType.value} 
              className={`cursor-pointer rounded-md px-3 py-2 text-base hover:bg-gray-100 ${
                docType.value === "student_card" ? "text-green-600 font-medium" : ""
              }`}
            >
              {docType.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {field.value === "student_card" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
          <p className="text-sm text-green-700">
            <strong>Carte étudiante - Service gratuit :</strong> Votre numéro de téléphone sera affiché directement pour permettre à l'étudiant de vous contacter immédiatement.
          </p>
        </div>
      )}
      
      {/* Nouvelle section pour la livraison à domicile */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
        <div className="flex items-start gap-2">
          <span className="text-lg">📦</span>
          <div>
            <p className="text-sm text-blue-700 font-medium">
              Option de livraison à domicile
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {t("deliveryOption")}
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
