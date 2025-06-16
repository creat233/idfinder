
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
    console.log('=== DÉBUT SOUMISSION FORMULAIRE ===');
    console.log('Values reçues:', values);
    console.log('ProfilePictureFile:', profilePictureFile);
    console.log('mcard existante:', mcard);
    console.log('preview:', preview);
    
    // Validation immédiate
    if (!values.full_name || values.full_name.trim() === '') {
      console.log('ERREUR: Nom complet manquant');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom complet est requis"
      });
      return;
    }

    if (!values.phone_number || values.phone_number.trim() === '') {
      console.log('ERREUR: Numéro de téléphone manquant');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le numéro de téléphone est requis"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('setIsSubmitting(true) appelé');
      
      // Pour la mise à jour, on garde le slug existant
      const slug = mcard ? mcard.slug : generateSlug(values.full_name);
      console.log('Slug utilisé:', slug);
      
      const data: TablesInsert<'mcards'> | TablesUpdate<'mcards'> = { 
        ...values,
        slug 
      };
      
      if (!preview) {
        data.profile_picture_url = null;
      }
      
      console.log('Données à soumettre:', data);
      console.log('=== APPEL DE onSubmit ===');
      
      const result = await onSubmit(data, profilePictureFile);
      console.log('=== RÉSULTAT DE onSubmit ===');
      console.log('Résultat:', result);
      
      if (result) {
        console.log('SUCCÈS: Résultat obtenu');
        
        // Toast de succès selon le mode
        if (mcard) {
          console.log('Mode mise à jour - toast de succès');
          toast({
            title: "Succès",
            description: "Votre carte a été mise à jour avec succès"
          });
        } else {
          console.log('Mode création - toast de succès');
          toast({
            title: "Succès", 
            description: "Votre carte a été créée avec succès"
          });
        }
        
        // Fermer le dialog
        if (onOpenChange) {
          console.log('Fermeture du dialog');
          onOpenChange(false);
        }
        
        // Navigation vers la carte
        console.log('Navigation vers:', `/mcard/${result.slug}`);
        navigate(`/mcard/${result.slug}`);
        
      } else {
        console.error('ERREUR: Aucun résultat retourné par onSubmit');
        throw new Error("Aucun résultat retourné lors de la sauvegarde");
      }
    } catch (error) {
      console.error('=== ERREUR DANS handleFormSubmit ===');
      console.error('Erreur complète:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la sauvegarde"
      });
    } finally {
      console.log('=== FIN SOUMISSION - setIsSubmitting(false) ===');
      setIsSubmitting(false);
    }
  };

  return { handleFormSubmit };
};
