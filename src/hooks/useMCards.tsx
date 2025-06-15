import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useTranslation } from './useTranslation';
import { v4 as uuidv4 } from 'uuid';

export type MCard = Tables<'mcards'> & {
  view_count?: number;
};

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

      const { data, error } = await supabase
        .from('mcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMCards(data || []);
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

  const uploadProfilePicture = async (file: File, userId: string): Promise<string | null> => {
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('mcard-profile-pictures')
        .upload(filePath, file, { upsert: true });

    if (uploadError) {
        console.error("Upload Error:", uploadError);
        throw new Error('Failed to upload profile picture.');
    }

    const { data } = supabase.storage
        .from('mcard-profile-pictures')
        .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const deleteProfilePicture = async (url: string) => {
      try {
        const path = new URL(url).pathname.split('/mcard-profile-pictures/')[1];
        if (path) {
            await supabase.storage.from('mcard-profile-pictures').remove([path]);
        }
      } catch (error) {
        console.error("Error deleting picture, it might not exist in storage:", error);
      }
  };

  const createMCard = useCallback(async (mcardData: TablesInsert<'mcards'>, profilePictureFile: File | null, options?: { silent?: boolean }) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      if (profilePictureFile) {
        const newUrl = await uploadProfilePicture(profilePictureFile, user.id);
        mcardData.profile_picture_url = newUrl;
      }

      const { data, error } = await supabase
        .from('mcards')
        .insert({ ...mcardData, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      
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

  const updateMCard = useCallback(async (id: string, mcardData: TablesUpdate<'mcards'>, profilePictureFile: File | null, originalCard: MCard, options?: { silent?: boolean }) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      if (profilePictureFile) {
        if(originalCard.profile_picture_url) {
            await deleteProfilePicture(originalCard.profile_picture_url);
        }
        const newUrl = await uploadProfilePicture(profilePictureFile, user.id);
        mcardData.profile_picture_url = newUrl;
      } else if (mcardData.profile_picture_url === null && originalCard.profile_picture_url) {
        await deleteProfilePicture(originalCard.profile_picture_url);
      }

      const { data, error } = await supabase
        .from('mcards')
        .update(mcardData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
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
      if(cardToDelete?.profile_picture_url) {
          await deleteProfilePicture(cardToDelete.profile_picture_url);
      }
      const { error } = await supabase.from('mcards').delete().eq('id', id);
      if (error) throw error;
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
      const { data, error } = await supabase
        .from('mcards')
        .update({ plan, subscription_status: 'pending_payment' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
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
