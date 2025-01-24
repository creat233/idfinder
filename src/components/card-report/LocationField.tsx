import { Control, UseFormReturn, useController } from "react-hook-form";
import { Input } from "@/components/ui/input";

export interface LocationFieldProps {
  name?: string;
  label?: string;
  placeholder?: string;
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
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <Input
        placeholder={placeholder}
        {...field}
        className={error ? "border-destructive" : ""}
      />
      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}