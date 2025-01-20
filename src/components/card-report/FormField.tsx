import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { useController, Control } from "react-hook-form";

interface FormFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  type?: string;
  error?: string;
  required?: boolean;
  max?: string;
  placeholder?: string;
  textarea?: boolean;
}

export const FormField = ({ 
  name,
  control,
  label, 
  type = "text",
  error,
  required,
  max,
  placeholder,
  textarea
}: FormFieldProps) => {
  const { field } = useController({
    name,
    control,
  });

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {textarea ? (
        <Textarea
          required={required}
          placeholder={placeholder}
          {...field}
          className={error ? "border-red-500" : ""}
        />
      ) : (
        <Input
          required={required}
          type={type}
          placeholder={placeholder}
          {...field}
          className={error ? "border-red-500" : ""}
          max={max}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};