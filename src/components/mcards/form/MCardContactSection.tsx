
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";
import { MCardFormData } from "./mcardFormSchema";

interface MCardContactSectionProps {
  register: UseFormRegister<MCardFormData>;
  errors: FieldErrors<MCardFormData>;
}

export const MCardContactSection = ({ register, errors }: MCardContactSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Separator />
      <h3 className="text-lg font-semibold">Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone_number">{t('phoneNumber')}</Label>
          <Input id="phone_number" {...register("phone_number")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website_url">{t('websiteUrl')}</Label>
        <Input id="website_url" {...register("website_url")} placeholder="https://monsite.com" />
        {errors.website_url && <p className="text-sm text-red-500">{errors.website_url.message}</p>}
      </div>
    </>
  );
};
