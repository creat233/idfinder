import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle } from "lucide-react";

interface LocationFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const LocationField = ({ value, onChange, error }: LocationFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Lieu où la carte a été trouvée</label>
      <div className="flex gap-2">
        <Input 
          required
          placeholder="Adresse" 
          value={value}
          onChange={onChange}
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