
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/hooks/useTranslation";
import { MCard } from "@/types/mcard";
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formSchema, MCardFormData } from "./form/mcardFormSchema";
import { MCardProfilePictureUpload } from "./form/MCardProfilePictureUpload";
import { MCardBasicInfoSection } from "./form/MCardBasicInfoSection";
import { MCardContactSection } from "./form/MCardContactSection";
import { MCardSocialMediaSection } from "./form/MCardSocialMediaSection";
import { MCardPublicationSection } from "./form/MCardPublicationSection";

interface MCardFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: TablesInsert<'mcards'> | TablesUpdate<'mcards'>, profilePictureFile: File | null) => Promise<MCard | null>;
  mcard?: MCard | null;
  loading: boolean;
}

// Fonction pour générer un slug à partir du nom complet
const generateSlug = (fullName: string): string => {
  return fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
    .trim()
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-'); // Supprime les tirets multiples
};

export const MCardFormDialog = ({ isOpen, onOpenChange, onSubmit, mcard, loading }: MCardFormDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<MCardFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
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
      snapchat_url: "",
      is_published: false,
    },
  });
  
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const defaultValues = {
        full_name: mcard?.full_name || "",
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
        snapchat_url: mcard?.snapchat_url || "",
        is_published: mcard?.is_published || false,
      };
      reset(defaultValues);
      setPreview(mcard?.profile_picture_url || null);
      setProfilePictureFile(null);
    }
  }, [isOpen, mcard, reset]);

  const handleFormSubmit = async (values: MCardFormData) => {
    try {
      setIsSubmitting(true);
      
      // Générer automatiquement le slug si c'est une nouvelle carte
      const slug = mcard ? mcard.slug : generateSlug(values.full_name);
      
      const data: TablesInsert<'mcards'> | TablesUpdate<'mcards'> = { 
        ...values,
        slug 
      };
      
      if (!preview) {
        data.profile_picture_url = null;
      }
      
      const result = await onSubmit(data, profilePictureFile);
      
      if (result) {
        onOpenChange(false);
        // Rediriger vers la page de visualisation de la carte
        setTimeout(() => {
          navigate(`/mcard/${result.slug}`);
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mcard ? t('editMCard') : t('createMCard')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-2">
          <MCardProfilePictureUpload 
            preview={preview}
            onFileChange={setProfilePictureFile}
            onPreviewChange={setPreview}
          />

          <MCardBasicInfoSection 
            register={register}
            errors={errors}
          />

          <MCardContactSection 
            register={register}
            errors={errors}
          />

          <MCardSocialMediaSection 
            register={register}
            errors={errors}
          />

          <MCardPublicationSection 
            control={control}
          />
          
          <DialogFooter>
            <Button type="submit" disabled={loading || isSubmitting}>
              {(loading || isSubmitting) ? t('loading') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
