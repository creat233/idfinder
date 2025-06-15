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
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "@/hooks/useTranslation";
import { MCard } from "@/types/mcard";
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image as ImageIcon, X } from 'lucide-react';

interface MCardFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: TablesInsert<'mcards'> | TablesUpdate<'mcards'>, profilePictureFile: File | null) => void;
  mcard?: MCard | null;
  loading: boolean;
}

const formSchema = z.object({
  full_name: z.string().min(2, "Le nom complet est requis"),
  slug: z.string().min(3, "Le slug est requis").regex(/^[a-z0-9-]+$/, "Slug invalide (lettres minuscules, chiffres et tirets)"),
  job_title: z.string().optional(),
  company: z.string().optional(),
  description: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal('')),
  website_url: z.string().url("URL invalide").optional().or(z.literal('')),
  is_published: z.boolean().default(false),
});

export const MCardFormDialog = ({ isOpen, onOpenChange, onSubmit, mcard, loading }: MCardFormDialogProps) => {
  const { t } = useTranslation();
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      slug: "",
      job_title: "",
      company: "",
      description: "",
      phone_number: "",
      email: "",
      website_url: "",
      is_published: false,
    },
  });
  
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const defaultValues = {
        full_name: mcard?.full_name || "",
        slug: mcard?.slug || "",
        job_title: mcard?.job_title || "",
        company: mcard?.company || "",
        description: mcard?.description || "",
        phone_number: mcard?.phone_number || "",
        email: mcard?.email || "",
        website_url: mcard?.website_url || "",
        is_published: mcard?.is_published || false,
      };
      reset(defaultValues);
      setPreview(mcard?.profile_picture_url || null);
      setProfilePictureFile(null);
    }
  }, [isOpen, mcard, reset]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setProfilePictureFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        // Clean up the object URL when component unmounts
        return () => URL.revokeObjectURL(objectUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'] },
      multiple: false,
  });

  const handleRemoveImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setProfilePictureFile(null);
      setPreview(null);
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const data: TablesInsert<'mcards'> | TablesUpdate<'mcards'> = { ...values };
    if (!preview) {
        data.profile_picture_url = null;
    }
    onSubmit(data, profilePictureFile);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{mcard ? t('editMCard') : t('createMCard')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
          <div className="space-y-2">
            <Label>{t('profilePhoto')}</Label>
            <div {...getRootProps()} className="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
              <input {...getInputProps()} />
              {preview ? (
                <div className="relative group w-24 h-24 mx-auto">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={preview} alt="Aperçu" className="object-cover" />
                    <AvatarFallback><ImageIcon className="h-8 w-8 text-muted-foreground" /></AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="destructive" size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleRemoveImage}
                    title={t('removeImage')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground h-24">
                  <ImageIcon className="h-8 w-8" />
                  {isDragActive ? <p>{t('dropImageActive')}</p> : <p className="text-sm">{t('dropImage')}</p>}
                </div>
              )}
            </div>
          </div>
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
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea id="description" {...register("description")} placeholder={t('mcardDescriptionPlaceholder')} />
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
