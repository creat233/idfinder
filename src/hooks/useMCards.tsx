import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useTranslation } from './useTranslation';

export type MCard = Tables<'mcards'>;

export const useMCards = () => {
  const [mcards, setMCards] = useState<MCard[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const getMCards = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('mcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMCards(data || []);
    } catch (error: any) {
      toast({ variant: "destructive", title: t('mCardError'), description: error.message });
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  const createMCard = useCallback(async (mcardData: TablesInsert<'mcards'>) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from('mcards')
        .insert({ ...mcardData, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      
      setMCards(prev => [data, ...prev]);
      toast({ title: t('mCardCreatedSuccess') });
      return data;
    } catch (error: any) {
      toast({ variant: "destructive", title: t('mCardError'), description: error.message });
      return null;
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  const updateMCard = useCallback(async (id: string, mcardData: TablesUpdate<'mcards'>, options?: { silent?: boolean }) => {
    try {
      setLoading(true);
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
      const { error } = await supabase.from('mcards').delete().eq('id', id);
      if (error) throw error;
      setMCards(prev => prev.filter(card => card.id !== id));
      toast({ title: t('mCardDeletedSuccess') });
    } catch (error: any) {
      toast({ variant: "destructive", title: t('mCardError'), description: error.message });
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  return { mcards, loading, getMCards, createMCard, updateMCard, deleteMCard };
};
