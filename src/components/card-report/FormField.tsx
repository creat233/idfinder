import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  max?: string;
  placeholder?: string;
}

export const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  error, 
  required, 
  max,
  placeholder 
}: FormFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <Input
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "border-red-500" : ""}
        max={max}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};