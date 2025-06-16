
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { MCard } from "@/types/mcard";
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { formSchema, MCardFormData } from "./mcardFormSchema";
import { MCardProfilePictureUpload } from "./MCardProfilePictureUpload";
import { MCardBasicInfoSection } from "./MCardBasicInfoSection";
import { MCardContactSection } from "./MCardContactSection";
import { MCardSocialMediaSection } from "./MCardSocialMediaSection";
import { MCardPublicationSection } from "./MCardPublicationSection";
import { useMCardFormSubmission } from "./MCardFormSubmissionHandler";
import { useMCardFormInitializer } from "./MCardFormInitializer";

interface MCardFormProps {
  isOpen: boolean;
  onSubmit: (data: TablesInsert<'mcards'> | TablesUpdate<'mcards'>, profilePictureFile: File | null) => Promise<MCard | null>;
  mcard?: MCard | null;
  loading: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const MCardForm = ({ isOpen, onSubmit, mcard, loading, onOpenChange }: MCardFormProps) => {
  const { t } = useTranslation();
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

  // Initialize form when dialog opens
  useMCardFormInitializer(isOpen, mcard, reset, setPreview, setProfilePictureFile);

  // Handle form submission
  const { handleFormSubmit } = useMCardFormSubmission(onSubmit, mcard, preview, onOpenChange);

  const onFormSubmit = (values: MCardFormData) => {
    handleFormSubmit(values, profilePictureFile, setIsSubmitting);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 p-2">
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
  );
};
