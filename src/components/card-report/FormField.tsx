import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Control, useController } from "react-hook-form";

export interface FormFieldProps {
  name: string;
  label: string;
  placeholder: string;
  control: Control<any>;
  type?: string;
  textarea?: boolean;
}

export function FormField({
  name,
  label,
  placeholder,
  control,
  type = "text",
  textarea = false,
}: FormFieldProps) {
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
      {textarea ? (
        <Textarea
          id={name}
          placeholder={placeholder}
          {...field}
          className={error ? "border-red-500" : ""}
        />
      ) : (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          {...field}
          className={error ? "border-red-500" : ""}
        />
      )}
      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
}