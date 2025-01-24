import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Control, UseFormReturn, useController } from "react-hook-form";

export interface LocationFieldProps {
  name?: string;
  label?: string;
  placeholder?: string;
  control?: Control<any>;
  form: UseFormReturn<any>;
}

export function LocationField({
  name = "location",
  label = "Localisation",
  placeholder = "Où avez-vous trouvé la carte ?",
  form,
}: LocationFieldProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control: form.control,
  });

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type="text"
        placeholder={placeholder}
        {...field}
        className={error ? "border-red-500" : ""}
      />
      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
}