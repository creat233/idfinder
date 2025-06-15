
import { useController, Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/providers/TranslationProvider";

interface LanguageSelectProps {
  control: Control<any>;
  name: string;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

export function LanguageSelect({ control, name, currentLanguage, onLanguageChange }: LanguageSelectProps) {
  const { t } = useTranslation();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: currentLanguage,
  });

  const handleChange = (value: string) => {
    field.onChange(value);
    onLanguageChange(value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{t('appLanguage')}</Label>
      <Select
        value={field.value}
        onValueChange={handleChange}
        defaultValue={currentLanguage}
      >
        <SelectTrigger 
          id={name}
          className={`w-full bg-white border ${error ? "border-destructive" : "border-input hover:border-primary"} rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        >
          <SelectValue placeholder={t('selectLanguage')} />
        </SelectTrigger>
        <SelectContent
          className="bg-white border border-gray-200 rounded-lg shadow-lg"
          position="popper"
          sideOffset={5}
        >
          {languages.map((language) => (
            <SelectItem 
              key={language.code} 
              value={language.code} 
              className="cursor-pointer rounded-md px-3 py-2 text-base hover:bg-gray-100"
            >
              <span className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
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
