
import { Control, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";
import { MCardFormData } from "./mcardFormSchema";

interface MCardPublicationSectionProps {
  control: Control<MCardFormData>;
}

export const MCardPublicationSection = ({ control }: MCardPublicationSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Separator />
      <div className="flex items-center space-x-2">
        <Controller
          name="is_published"
          control={control}
          render={({ field }) => (
            <Switch
              id="is_published"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <div>
          <Label htmlFor="is_published">{t('isPublished')}</Label>
          <p className="text-sm text-muted-foreground">{t('isPublishedDescription')}</p>
        </div>
      </div>
    </>
  );
};
