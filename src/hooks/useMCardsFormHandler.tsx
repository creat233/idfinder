
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
        } else {
          console.error('updateMCard a retourné null');
          throw new Error('Échec de la mise à jour de la carte');
        }
        
        return result;
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
        
        const result = await createMCard(newCardData, profilePictureFile, { silent: true });
        console.log('Résultat de createMCard:', result);

        if (result) {
          if (planForNewCard === 'free') {
            console.log('Plan gratuit - toast de succès');
            toast({ title: t('mCardCreatedSuccess'), description: t('mCardFreePlanActive') });
          } else {
            const planName = planForNewCard === 'essential' ? t('planEssential') : t('planPremium');
            console.log('Plan payant - toast de demande de mise à niveau');
            toast({ 
              title: t('planUpgradeRequestSent'),
              description: t('planUpgradeRequestSentDescription').replace('{planName}', planName)
            });
          }
          setIsFormOpen(false);
          setPlanForNewCard(null);
          console.log('Création terminée avec succès');
        } else {
          console.error('createMCard a retourné null');
          throw new Error('Échec de la création de la carte');
        }
        
        setIsCreating(false);
        return result;
      }
      
      console.warn('Ni editingMCard ni planForNewCard défini');
      throw new Error('Configuration invalide pour la soumission');
    } catch (error) {
      console.error('=== ERREUR DANS handleFormSubmit ===');
      console.error('Erreur:', error);
      setIsCreating(false);
      throw error; // Re-lancer l'erreur pour que le composant form puisse la gérer
    }
  };

  const handleFormOpenChange = (isOpen: boolean) => {
    console.log('Dialog onOpenChange:', isOpen);
    if (!isOpen) {
        setEditingMCard(null);
        setPlanForNewCard(null);
    }
    setIsFormOpen(isOpen);
  };

  // Pour l'édition, on ne passe pas l'état loading global car il peut bloquer le formulaire
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
