
import { useController, Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CountrySelectProps {
  control: Control<any>;
  name: string;
}

const countries = [
  { code: "SN", name: "Sénégal", flag: "🇸🇳" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "MA", name: "Maroc", flag: "🇲🇦" },
  { code: "DZ", name: "Algérie", flag: "🇩🇿" },
  { code: "TN", name: "Tunisie", flag: "🇹🇳" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "NE", name: "Niger", flag: "🇳🇪" },
  { code: "GN", name: "Guinée", flag: "🇬🇳" },
  { code: "MR", name: "Mauritanie", flag: "🇲🇷" },
  { code: "GM", name: "Gambie", flag: "🇬🇲" },
  { code: "GW", name: "Guinée-Bissau", flag: "🇬🇼" },
  { code: "CV", name: "Cap-Vert", flag: "🇨🇻" },
  { code: "ES", name: "Espagne", flag: "🇪🇸" },
  { code: "IT", name: "Italie", flag: "🇮🇹" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪" },
  { code: "BE", name: "Belgique", flag: "🇧🇪" },
  { code: "CH", name: "Suisse", flag: "🇨🇭" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "US", name: "États-Unis", flag: "🇺🇸" },
];

export function CountrySelect({ control, name }: CountrySelectProps) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: "SN",
  });

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>Pays de résidence</Label>
      <Select
        value={field.value}
        onValueChange={field.onChange}
        defaultValue="SN"
      >
        <SelectTrigger 
          id={name}
          className={`w-full bg-white border ${error ? "border-destructive" : "border-input hover:border-primary"} rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        >
          <SelectValue placeholder="Sélectionnez votre pays" />
        </SelectTrigger>
        <SelectContent
          className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          position="popper"
          sideOffset={5}
        >
          {countries.map((country) => (
            <SelectItem 
              key={country.code} 
              value={country.code} 
              className="cursor-pointer rounded-md px-3 py-2 text-base hover:bg-gray-100"
            >
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}
