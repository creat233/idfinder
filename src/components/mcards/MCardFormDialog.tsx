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
import { Separator } from "@/components/ui/separator";

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
  linkedin_url: z.string().url("URL LinkedIn invalide").optional().or(z.literal('')),
  twitter_url: z.string().url("URL Twitter invalide").optional().or(z.literal('')),
  facebook_url: z.string().url("URL Facebook invalide").optional().or(z.literal('')),
  instagram_url: z.string().url("URL Instagram invalide").optional().or(z.literal('')),
  youtube_url: z.string().url("URL YouTube invalide").optional().or(z.literal('')),
  tiktok_url: z.string().url("URL TikTok invalide").optional().or(z.literal('')),
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
      linkedin_url: "",
      twitter_url: "",
      facebook_url: "",
      instagram_url: "",
      youtube_url: "",
      tiktok_url: "",
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
        linkedin_url: mcard?.linkedin_url || "",
        twitter_url: mcard?.twitter_url || "",
        facebook_url: mcard?.facebook_url || "",
        instagram_url: mcard?.instagram_url || "",
        youtube_url: mcard?.youtube_url || "",
        tiktok_url: mcard?.tiktok_url || "",
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mcard ? t('editMCard') : t('createMCard')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-2">
          {/* Photo de profil */}
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

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Contact */}
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

          {/* Réseaux sociaux */}
          <Separator />
          <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input id="linkedin_url" {...register("linkedin_url")} placeholder="https://linkedin.com/in/votreprofil" />
              {errors.linkedin_url && <p className="text-sm text-red-500">{errors.linkedin_url.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter_url">Twitter / X</Label>
              <Input id="twitter_url" {...register("twitter_url")} placeholder="https://twitter.com/votrecompte" />
              {errors.twitter_url && <p className="text-sm text-red-500">{errors.twitter_url.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook</Label>
              <Input id="facebook_url" {...register("facebook_url")} placeholder="https://facebook.com/votreprofil" />
              {errors.facebook_url && <p className="text-sm text-red-500">{errors.facebook_url.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram</Label>
              <Input id="instagram_url" {...register("instagram_url")} placeholder="https://instagram.com/votrecompte" />
              {errors.instagram_url && <p className="text-sm text-red-500">{errors.instagram_url.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube</Label>
              <Input id="youtube_url" {...register("youtube_url")} placeholder="https://youtube.com/@votreschaine" />
              {errors.youtube_url && <p className="text-sm text-red-500">{errors.youtube_url.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok_url">TikTok</Label>
              <Input id="tiktok_url" {...register("tiktok_url")} placeholder="https://tiktok.com/@votrecompte" />
              {errors.tiktok_url && <p className="text-sm text-red-500">{errors.tiktok_url.message}</p>}
            </div>
          </div>

          {/* Publication */}
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
          
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? t('loading') : t('save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
