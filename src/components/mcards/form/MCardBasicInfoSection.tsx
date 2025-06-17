
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/useTranslation";
import { MCardFormData } from "./mcardFormSchema";

interface MCardBasicInfoSectionProps {
  register: UseFormRegister<MCardFormData>;
  errors: FieldErrors<MCardFormData>;
}

export const MCardBasicInfoSection = ({ register, errors }: MCardBasicInfoSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="full_name">{t('fullName')}</Label>
        <Input id="full_name" {...register("full_name")} />
        {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="job_title">{t('jobTitle')}</Label>
          <Input id="job_title" {...register("job_title")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">{t('company')}</Label>
          <Input id="company" {...register("company")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('description')}</Label>
        <Textarea id="description" {...register("description")} placeholder={t('mcardDescriptionPlaceholder')} />
      </div>
    </>
  );
};
