
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { MCard, MCardCreateData, MCardUpdateData } from '@/types/mcard';

interface UseMCardsFormHandlerProps {
  mcards: MCard[];
  createMCard: (data: MCardCreateData, file: File | null, options?: { silent: boolean }) => Promise<MCard | null>;
  updateMCard: (id: string, data: MCardUpdateData, file: File | null, originalCard: MCard) => Promise<MCard | null>;
  loading: boolean;
}

export const useMCardsFormHandler = ({ 
  mcards, 
  createMCard, 
  updateMCard, 
  loading 
}: UseMCardsFormHandlerProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMCard, setEditingMCard] = useState<MCard | null>(null);
  const [planForNewCard, setPlanForNewCard] = useState<'free' | 'essential' | 'premium' | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleOpenEdit = (mcard: MCard) => {
    console.log('Ouverture de l\'édition pour la carte:', mcard);
    setPlanForNewCard(null);
    setEditingMCard(mcard);
    setIsCreating(false); // Reset creating state
    setIsFormOpen(true);
  };

  useEffect(() => {
    const editMCardId = location.state?.editMCardId;
    if (editMCardId && mcards.length > 0) {
        const cardToEdit = mcards.find(m => m.id === editMCardId);
        if (cardToEdit) {
            handleOpenEdit(cardToEdit);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }
  }, [location.state, mcards, navigate]);

  const handleStartCreationFlow = (plan: 'free' | 'essential' | 'premium') => {
    console.log('Démarrage du flux de création pour le plan:', plan);
    setEditingMCard(null);
    setPlanForNewCard(plan);
    setIsCreating(false); // Reset creating state
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: MCardCreateData | MCardUpdateData, profilePictureFile: File | null): Promise<MCard | null> => {
    console.log('=== handleFormSubmit appelé ===');
    console.log('Data:', data);
    console.log('Profile picture file:', profilePictureFile);
    console.log('Editing mCard:', editingMCard);
    console.log('Plan for new card:', planForNewCard);
    
    try {
      if (editingMCard) {
        console.log('=== MODE ÉDITION ===');
        console.log('ID de la carte à modifier:', editingMCard.id);
        
        const result = await updateMCard(editingMCard.id, data, profilePictureFile, editingMCard);
        console.log('Résultat de updateMCard:', result);
        
        if (result) {
          console.log('Mise à jour réussie');
          setIsFormOpen(false);
          setEditingMCard(null);
          setIsCreating(false);
          return result;
        } else {
          console.error('updateMCard a retourné null');
          throw new Error('Échec de la mise à jour de la carte');
        }
      } else if (planForNewCard) {
        console.log('=== MODE CRÉATION ===');
        console.log('Plan sélectionné:', planForNewCard);
        
        setIsCreating(true);
        
        const newCardData: MCardCreateData = {
          ...(data as MCardCreateData),
          plan: planForNewCard,
          subscription_status: planForNewCard === 'free' ? 'trial' : 'pending_payment',
        };
        
        console.log('Données de création:', newCardData);
        
        const result = await createMCard(newCardData, profilePictureFile, { silent: false });
        console.log('Résultat de createMCard:', result);

        if (result) {
          console.log('Création réussie, fermeture du formulaire');
          setIsFormOpen(false);
          setPlanForNewCard(null);
          setIsCreating(false);
          
          console.log('Carte créée avec succès:', result.id);
          
          return result;
        } else {
          console.error('createMCard a retourné null');
          setIsCreating(false);
          throw new Error('Échec de la création de la carte');
        }
      }
      
      console.warn('Ni editingMCard ni planForNewCard défini');
      throw new Error('Configuration invalide pour la soumission');
    } catch (error) {
      console.error('=== ERREUR DANS handleFormSubmit ===');
      console.error('Erreur:', error);
      setIsCreating(false);
      throw error;
    }
  };

  const handleFormOpenChange = (isOpen: boolean) => {
    console.log('Dialog onOpenChange:', isOpen);
    if (!isOpen) {
        setEditingMCard(null);
        setPlanForNewCard(null);
        setIsCreating(false);
    }
    setIsFormOpen(isOpen);
  };

  const formLoading = editingMCard ? false : loading;

  return {
    isFormOpen,
    editingMCard,
    planForNewCard,
    isCreating,
    formLoading,
    handleOpenEdit,
    handleStartCreationFlow,
    handleFormSubmit,
    handleFormOpenChange,
  };
};
