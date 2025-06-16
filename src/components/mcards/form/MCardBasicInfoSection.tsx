
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { MCardFormData } from "./mcardFormSchema";
import { Link, ExternalLink } from "lucide-react";

interface MCardBasicInfoSectionProps {
  register: UseFormRegister<MCardFormData>;
  errors: FieldErrors<MCardFormData>;
}

export const MCardBasicInfoSection = ({ register, errors }: MCardBasicInfoSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">{t('fullName')}</Label>
          <Input id="full_name" {...register("full_name")} />
          {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            {t('slug')}
          </Label>
          <div className="relative">
            <Input 
              id="slug" 
              {...register("slug")} 
              placeholder="prenom-nom"
              className="pr-8"
            />
            <ExternalLink className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <DialogDescription className="text-sm text-blue-800">
              <strong>Identifiant unique pour votre URL personnalisée</strong>
              <br />
              Votre carte sera accessible via : <span className="font-mono bg-blue-100 px-1 py-0.5 rounded">finderid.com/mcard/votre-slug</span>
              <br />
              <span className="text-xs text-blue-600">Utilisez uniquement des lettres minuscules, chiffres et tirets (ex: jean-dupont)</span>
            </DialogDescription>
          </div>
          {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
        </div>
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
