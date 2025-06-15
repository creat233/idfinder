
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
    { value: "id", label: t("idCard") },
    { value: "driver_license", label: t("driverLicense") },
    { value: "passport", label: t("passport") },
    { value: "vehicle_registration", label: t("vehicleRegistration") },
    { value: "motorcycle_registration", label: t("motorcycleRegistration") },
    { value: "residence_permit", label: t("residencePermit") },
    { value: "student_card", label: t("documentTypeStudentCardFree") },
    { value: "health_card", label: t("documentTypeHealthCardFree") },
  ];

  const isFreeService = field.value === "student_card" || field.value === "health_card";

  return (
    <div className="space-y-2">
      <Label htmlFor="documentType">{t("documentType")}</Label>
      <Select
        value={field.value}
        onValueChange={field.onChange}
        defaultValue="id"
      >
        <SelectTrigger 
          id="documentType"
          className={`w-full ${error ? "border-destructive" : ""}`}
        >
          <SelectValue placeholder={t("selectDocumentType")} />
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
              {field.value === "student_card" ? t("studentCard") : t("healthCard")} - {t("freeServiceTitle")}
            </strong> {t("freeServiceDesc")}
          </p>
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
        <div className="flex items-start gap-2">
          <span className="text-lg">📦</span>
          <div>
            <p className="text-sm text-blue-700 font-medium">
              {t("deliveryOptionTitle")}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {t("deliveryOptionDesc1")}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {t("deliveryOptionDesc2")}
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
