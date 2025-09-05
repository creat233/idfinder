import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from './useTranslation';
import { MCard, MCardCreateData, MCardUpdateData, MCardFormOptions } from '@/types/mcard';
import * as mcardService from '@/services/mcardService';

export const useMCards = () => {
  const [mcards, setMCards] = useState<MCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  const getMCards = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMCards([]);
        return;
      };

      const data = await mcardService.fetchMCards(user.id);
      setMCards(data);
    } catch (error: any) {
      toast({ variant: "destructive", title: t('mCardError'), description: error.message });
    }
  }, [t, toast]);

  useEffect(() => {
    getMCards().finally(() => setLoading(false));

    // Écouter les changements en temps réel pour actualiser automatiquement l'admin
    const channel = supabase
      .channel('mcards-realtime')
      .on<MCard>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mcards',
        },
        (payload) => {
          console.log('mCard change received!', payload);
          getMCards();
          
          // Notifier l'admin si une nouvelle carte est créée
          if (payload.eventType === 'INSERT') {
            console.log('Nouvelle mCard créée - notification admin');
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [getMCards]);

  const createMCard = useCallback(async (mcardData: MCardCreateData, profilePictureFile: File | null, options?: MCardFormOptions) => {
    try {
      setLoading(true);
      console.log('=== createMCard appelé ===');
      console.log('Data:', mcardData);
      console.log('Profile picture file:', profilePictureFile);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error("Erreur d'authentification");
      }
      if (!user) {
        console.error('No user found');
        throw new Error("Utilisateur non trouvé. Veuillez vous reconnecter.");
      }

      console.log('User authenticated:', user.id);
      const data = await mcardService.createMCard(mcardData, profilePictureFile, user.id);
      console.log('Card created successfully:', data);
      
      setMCards(prev => [data, ...prev]);
      if (!options?.silent) {
        toast({ 
          title: t('mCardCreatedSuccess'),
          description: "Votre carte est en attente de validation par l'administration"
        });
      }
      return data;
    } catch (error: any) {
      console.error('Error creating mCard:', error);
      toast({ variant: "destructive", title: t('mCardError'), description: error.message });
      return null;
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  const updateMCard = useCallback(async (id: string, mcardData: MCardUpdateData, profilePictureFile: File | null, originalCard: MCard, options?: MCardFormOptions) => {
    try {
      setLoading(true);
      console.log('=== updateMCard appelé ===');
      console.log('ID:', id);
      console.log('Data:', mcardData);
      console.log('Profile picture file:', profilePictureFile);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error("Erreur d'authentification");
      }
      if (!user) {
        console.error('No user found');
        throw new Error("Utilisateur non trouvé. Veuillez vous reconnecter.");
      }

      console.log('User authenticated:', user.id);
      const data = await mcardService.updateMCard(id, mcardData, profilePictureFile, originalCard, user.id);
      console.log('Card updated successfully:', data);
      
      setMCards(prev => prev.map(card => card.id === id ? data : card));
      if (!options?.silent) {
        toast({ title: t('mCardUpdatedSuccess') });
      }
      return data;
    } catch (error: any) {
      console.error('Error updating mCard:', error);
      toast({ variant: "destructive", title: t('mCardError'), description: error.message });
      return null;
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  const deleteMCard = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const cardToDelete = mcards.find(m => m.id === id);
      await mcardService.deleteMCard(id, cardToDelete?.profile_picture_url);
      setMCards(prev => prev.filter(card => card.id !== id));
      toast({ title: t('mCardDeletedSuccess') });
    } catch (error: any) {
      toast({ variant: "destructive", title: t('mCardError'), description: error.message });
    } finally {
      setLoading(false);
    }
  }, [t, toast, mcards]);

  const requestPlanUpgrade = useCallback(async (id: string, plan: 'essential' | 'premium') => {
    try {
      setLoading(true);
      const data = await mcardService.requestPlanUpgrade(id, plan);
      
      setMCards(prev => prev.map(card => card.id === id ? data : card));
      
      const planName = plan === 'essential' ? t('planEssential') : t('planPremium');
      toast({ 
        title: t('planUpgradeRequestSent'),
        description: t('planUpgradeRequestSentDescription').replace('{planName}', planName)
      });
      return data;
    } catch (error: any) {
      toast({ variant: "destructive", title: t('mCardError'), description: error.message });
      return null;
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  return { mcards, loading, getMCards, createMCard, updateMCard, deleteMCard, requestPlanUpgrade };
};
