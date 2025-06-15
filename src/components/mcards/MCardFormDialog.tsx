
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "@/hooks/useTranslation";
import { MCard } from "@/hooks/useMCards";
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

interface MCardFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: TablesInsert<'mcards'> | TablesUpdate<'mcards'>) => void;
  mcard?: MCard | null;
  loading: boolean;
}

const formSchema = z.object({
  full_name: z.string().min(2, "Le nom complet est requis"),
  slug: z.string().min(3, "Le slug est requis").regex(/^[a-z0-9-]+$/, "Slug invalide (lettres minuscules, chiffres et tirets)"),
  job_title: z.string().optional(),
  company: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal('')),
  website_url: z.string().url("URL invalide").optional().or(z.literal('')),
  is_published: z.boolean().default(false),
});

export const MCardFormDialog = ({ isOpen, onOpenChange, onSubmit, mcard, loading }: MCardFormDialogProps) => {
  const { t } = useTranslation();
  const { register, handleSubmit, control, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: mcard?.full_name || "",
      slug: mcard?.slug || "",
      job_title: mcard?.job_title || "",
      company: mcard?.company || "",
      phone_number: mcard?.phone_number || "",
      email: mcard?.email || "",
      website_url: mcard?.website_url || "",
      is_published: mcard?.is_published || false,
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mcard ? t('editMCard') : t('createMCard')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">{t('fullName')}</Label>
            <Input id="full_name" {...register("full_name")} />
            {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">{t('slug')}</Label>
            <Input id="slug" {...register("slug")} />
            <DialogDescription>{t('slugDescription')}</DialogDescription>
            {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="job_title">{t('jobTitle')}</Label>
            <Input id="job_title" {...register("job_title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">{t('company')}</Label>
            <Input id="company" {...register("company")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">{t('phoneNumber')}</Label>
            <Input id="phone_number" {...register("phone_number")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="website_url">{t('websiteUrl')}</Label>
            <Input id="website_url" {...register("website_url")} />
            {errors.website_url && <p className="text-sm text-red-500">{errors.website_url.message}</p>}
          </div>
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
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? t('loading') : t('save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

