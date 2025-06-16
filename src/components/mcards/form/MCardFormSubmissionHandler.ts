
import { MCardFormData } from "./mcardFormSchema";
import { MCard } from "@/types/mcard";
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "@/hooks/useTranslation";

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

export const useMCardFormSubmission = (
  onSubmit: (data: TablesInsert<'mcards'> | TablesUpdate<'mcards'>, profilePictureFile: File | null) => Promise<MCard | null>,
  mcard?: MCard | null,
  preview?: string | null,
  onOpenChange?: (isOpen: boolean) => void
) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFormSubmit = async (
    values: MCardFormData, 
    profilePictureFile: File | null,
    setIsSubmitting: (submitting: boolean) => void
  ) => {
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
        onOpenChange?.(false);
        
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

  return { handleFormSubmit };
};
