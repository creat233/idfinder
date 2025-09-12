
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
      
      // Gérer explicitement la photo de profil
      if (profilePictureFile) {
        // Un nouveau fichier a été uploadé, le service s'occupera de l'upload
        console.log('Nouveau fichier photo détecté');
        // Ne pas définir profile_picture_url, le service le fera
      } else if (preview === null || preview === '') {
        // Suppression explicite de la photo
        console.log('Suppression de la photo de profil');
        data.profile_picture_url = null;
      } else if (preview && mcard && preview !== mcard.profile_picture_url) {
        // Une nouvelle URL de preview (différente de l'originale)
        console.log('Nouvelle URL de photo détectée');
        data.profile_picture_url = preview;
      } else if (mcard && mcard.profile_picture_url) {
        // Garder l'URL existante si pas de changement
        console.log('Conservation de la photo existante');
        // Ne pas modifier profile_picture_url
      }
      
      console.log('Données à soumettre:', data);
      console.log('=== APPEL DE onSubmit ===');
      
      const result = await onSubmit(data, profilePictureFile);
      console.log('=== RÉSULTAT DE onSubmit ===');
      console.log('Résultat:', result);
      
      if (result) {
        console.log('SUCCÈS: Résultat obtenu, carte créée avec ID:', result.id);
        
        // Fermer le dialog d'abord
        if (onOpenChange) {
          console.log('Fermeture du dialog');
          onOpenChange(false);
        }
        
        // Attendre un peu avant la navigation pour s'assurer que l'état est mis à jour
        setTimeout(() => {
          console.log('Navigation vers:', `/mcard/${result.slug}`);
          navigate(`/mcard/${result.slug}`);
        }, 500);
        
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
