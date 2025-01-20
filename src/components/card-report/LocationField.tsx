import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Control, useController } from "react-hook-form";

export interface LocationFieldProps {
  name: string;
  label: string;
  placeholder: string;
  control: Control<any>;
}

export function LocationField({
  name,
  label,
  placeholder,
  control,
}: LocationFieldProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
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