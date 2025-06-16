
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
    try {
      console.log('handleFormSubmit appelé avec:', { data, profilePictureFile, editingMCard, planForNewCard });
      
      if (editingMCard) {
        console.log('Mode édition');
        const result = await updateMCard(editingMCard.id, data, profilePictureFile, editingMCard);
        if (result) {
          setIsFormOpen(false);
          setEditingMCard(null);
          console.log('Carte mise à jour avec succès:', result);
        }
        return result;
      } else if (planForNewCard) {
        console.log('Mode création avec plan:', planForNewCard);
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
        }
        
        setIsCreating(false);
        return result;
      }
      
      console.warn('Ni editingMCard ni planForNewCard défini');
      return null;
    } catch (error) {
      console.error('Erreur dans handleFormSubmit:', error);
      setIsCreating(false);
      throw error;
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

  return {
    isFormOpen,
    editingMCard,
    planForNewCard,
    isCreating,
    handleOpenEdit,
    handleStartCreationFlow,
    handleFormSubmit,
    handleFormOpenChange,
  };
};
