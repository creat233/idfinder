import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle } from "lucide-react";
import { useController, Control } from "react-hook-form";

interface LocationFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  error?: string;
  placeholder?: string;
}

export const LocationField = ({ 
  name,
  control,
  label,
  error,
  placeholder 
}: LocationFieldProps) => {
  const { field } = useController({
    name,
    control,
  });

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2">
        <Input 
          required
          placeholder={placeholder}
          {...field}
          className={error ? "border-red-500" : ""}
        />
        <Button variant="outline" size="icon" type="button">
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};