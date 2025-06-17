
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const data = await mcardService.createMCard(mcardData, profilePictureFile, user.id);
      
      setMCards(prev => [data, ...prev]);
      if (!options?.silent) {
        toast({ title: t('mCardCreatedSuccess') });
      }
      return data;
    } catch (error: any) {
      toast({ variant: "destructive", title: t('mCardError'), description: error.message });
      return null;
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  const updateMCard = useCallback(async (id: string, mcardData: MCardUpdateData, profilePictureFile: File | null, originalCard: MCard, options?: MCardFormOptions) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const data = await mcardService.updateMCard(id, mcardData, profilePictureFile, originalCard, user.id);
      
      setMCards(prev => prev.map(card => card.id === id ? data : card));
      if (!options?.silent) {
        toast({ title: t('mCardUpdatedSuccess') });
      }
      return data;
    } catch (error: any) {
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
