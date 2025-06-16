
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
import { useToast } from '@/hooks/use-toast';
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

// Fonction pour générer un slug à partir du nom complet avec vérification d'unicité
const generateSlug = (fullName: string): string => {
  const baseSlug = fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
    .trim()
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-'); // Supprime les tirets multiples
  
  // Ajouter un timestamp pour garantir l'unicité
  const timestamp = Date.now().toString().slice(-6);
  return `${baseSlug}-${timestamp}`;
};

export const MCardFormDialog = ({ isOpen, onOpenChange, onSubmit, mcard, loading }: MCardFormDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<MCardFormData>({
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

  // Watch for form changes to provide feedback
  const watchedValues = watch();

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
      
      console.log('Début de la soumission du formulaire', values);
      
      // Vérifier que le nom complet est présent
      if (!values.full_name || values.full_name.trim() === '') {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le nom complet est requis"
        });
        return;
      }
      
      // Générer automatiquement le slug si c'est une nouvelle carte
      const slug = mcard ? mcard.slug : generateSlug(values.full_name);
      console.log('Slug généré:', slug);
      
      const data: TablesInsert<'mcards'> | TablesUpdate<'mcards'> = { 
        ...values,
        slug 
      };
      
      if (!preview) {
        data.profile_picture_url = null;
      }
      
      console.log('Données à soumettre:', data);
      
      const result = await onSubmit(data, profilePictureFile);
      console.log('Résultat de la soumission:', result);
      
      if (result) {
        console.log('Création réussie, fermeture du dialog et navigation vers:', `/mcard/${result.slug}`);
        onOpenChange(false);
        
        // Toast de succès
        toast({
          title: mcard ? t('mCardUpdatedSuccess') : t('mCardCreatedSuccess'),
          description: "Redirection vers votre carte..."
        });
        
        // Redirection immédiate
        navigate(`/mcard/${result.slug}`);
      } else {
        console.error('Aucun résultat retourné par onSubmit');
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de la carte"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading || isSubmitting || !watchedValues.full_name?.trim()}
            >
              {(loading || isSubmitting) ? t('loading') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
