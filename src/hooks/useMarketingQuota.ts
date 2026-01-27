import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MarketingQuota {
  freeRemaining: number;
  paidRemaining: number;
  totalRemaining: number;
  canSend: boolean;
  freeLimit: number;
  weekStart: string;
}

interface MarketingPack {
  id: string;
  packSize: number;
  priceFcfa: number;
  messagesRemaining: number;
  purchasedAt: string;
}

export const MARKETING_PACKS = [
  { size: 100, price: 5000, label: '100 messages' },
  { size: 200, price: 9000, label: '200 messages' },
  { size: 300, price: 12000, label: '300 messages' },
  { size: 500, price: 18000, label: '500 messages' },
  { size: 800, price: 25000, label: '800 messages' },
  { size: 1000, price: 30000, label: '1000 messages' },
];

export const useMarketingQuota = (mcardId: string) => {
  const [quota, setQuota] = useState<MarketingQuota>({
    freeRemaining: 20,
    paidRemaining: 0,
    totalRemaining: 20,
    canSend: true,
    freeLimit: 20,
    weekStart: ''
  });
  const [packs, setPacks] = useState<MarketingPack[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuota = useCallback(async () => {
    if (!mcardId) return;
    
    try {
      const { data, error } = await supabase
        .rpc('get_available_marketing_messages', { p_mcard_id: mcardId });

      if (error) throw error;

      if (data && data.length > 0) {
        const result = data[0];
        setQuota({
          freeRemaining: result.free_remaining || 0,
          paidRemaining: result.paid_remaining || 0,
          totalRemaining: result.total_remaining || 0,
          canSend: result.can_send || false,
          freeLimit: 20,
          weekStart: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error fetching marketing quota:', error);
    } finally {
      setLoading(false);
    }
  }, [mcardId]);

  const fetchPacks = useCallback(async () => {
    if (!mcardId) return;

    try {
      const { data, error } = await supabase
        .from('mcard_marketing_packs')
        .select('*')
        .eq('mcard_id', mcardId)
        .gt('messages_remaining', 0)
        .order('purchased_at', { ascending: false });

      if (error) throw error;

      setPacks((data || []).map(pack => ({
        id: pack.id,
        packSize: pack.pack_size,
        priceFcfa: pack.price_fcfa,
        messagesRemaining: pack.messages_remaining,
        purchasedAt: pack.purchased_at
      })));
    } catch (error) {
      console.error('Error fetching marketing packs:', error);
    }
  }, [mcardId]);

  useEffect(() => {
    fetchQuota();
    fetchPacks();
  }, [fetchQuota, fetchPacks]);

  const refresh = useCallback(() => {
    fetchQuota();
    fetchPacks();
  }, [fetchQuota, fetchPacks]);

  return {
    quota,
    packs,
    loading,
    refresh
  };
};
