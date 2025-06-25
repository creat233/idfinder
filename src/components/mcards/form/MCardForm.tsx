
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from 'react';
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

  // Reset submitting state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Initialize form when dialog opens
  useMCardFormInitializer(isOpen, mcard, reset, setPreview, setProfilePictureFile);

  // Handle form submission
  const { handleFormSubmit } = useMCardFormSubmission(onSubmit, mcard, preview, onOpenChange);

  const onFormSubmit = (values: MCardFormData) => {
    console.log('=== onFormSubmit appelé ===');
    console.log('Values du formulaire:', values);
    console.log('isSubmitting avant:', isSubmitting);
    
    if (isSubmitting) {
      console.log('PROTECTION: Soumission déjà en cours, abandon');
      return;
    }
    
    handleFormSubmit(values, profilePictureFile, setIsSubmitting);
  };

  const handleClose = () => {
    console.log('handleClose appelé, isSubmitting:', isSubmitting);
    if (!isSubmitting) {
      // Reset form state when closing
      setIsSubmitting(false);
      setProfilePictureFile(null);
      setPreview(null);
      onOpenChange(false);
    }
  };

  // Le bouton est actif si le nom complet et le numéro de téléphone sont remplis et qu'on n'est pas en train de soumettre
  const isSubmitDisabled = isSubmitting || !watchedValues.full_name?.trim() || !watchedValues.phone_number?.trim();

  console.log('=== État du formulaire ===');
  console.log('loading:', loading);
  console.log('isSubmitting:', isSubmitting);
  console.log('mcard:', mcard ? 'existe' : 'null');
  console.log('full_name:', watchedValues.full_name);
  console.log('phone_number:', watchedValues.phone_number);
  console.log('isSubmitDisabled:', isSubmitDisabled);

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Photo de profil - Section mise en avant */}
        <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <MCardProfilePictureUpload 
              preview={preview}
              onFileChange={setProfilePictureFile}
              onPreviewChange={setPreview}
            />
          </CardContent>
        </Card>

        {/* Informations de base */}
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Informations personnelles</h3>
            </div>
            <MCardBasicInfoSection 
              register={register}
              errors={errors}
            />
          </CardContent>
        </Card>

        {/* Informations de contact */}
        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Contact</h3>
            </div>
            <MCardContactSection 
              register={register}
              errors={errors}
            />
          </CardContent>
        </Card>

        {/* Réseaux sociaux */}
        <Card className="shadow-sm border-l-4 border-l-purple-500">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Réseaux sociaux</h3>
              <span className="text-sm text-gray-500">(Optionnel)</span>
            </div>
            <MCardSocialMediaSection 
              register={register}
              errors={errors}
            />
          </CardContent>
        </Card>

        {/* Publication */}
        <Card className="shadow-sm border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Publication</h3>
            </div>
            <MCardPublicationSection 
              control={control}
            />
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <Card className="bg-gray-50 border-2">
          <CardContent className="p-6">
            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitDisabled}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:transform-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Création en cours...
                  </div>
                ) : (
                  mcard ? 'Mettre à jour ma carte' : 'Créer ma carte'
                )}
              </Button>
            </DialogFooter>

            {/* Informations d'aide */}
            {!watchedValues.full_name?.trim() || !watchedValues.phone_number?.trim() ? (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Champs requis :</span> Le nom complet et le numéro de téléphone sont obligatoires pour créer votre carte.
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Prêt à créer !</span> Votre carte sera créée avec les informations saisies.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
