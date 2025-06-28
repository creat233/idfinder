
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MCard } from '@/types/mcard';

interface UseMCardRealtimeProps {
  mcard: MCard | null;
  slug?: string;
  refreshData: () => void;
}

export const useMCardRealtime = ({ mcard, slug, refreshData }: UseMCardRealtimeProps) => {
  useEffect(() => {
    if (!mcard || slug === 'demo') return;

    const statusesChannel = supabase
      .channel('mcard-statuses-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mcard_statuses',
        filter: `mcard_id=eq.${mcard.id}`
      }, () => {
        refreshData();
      })
      .subscribe();

    const productsChannel = supabase
      .channel('mcard-products-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mcard_products',
        filter: `mcard_id=eq.${mcard.id}`
      }, () => {
        refreshData();
      })
      .subscribe();

    const reviewsChannel = supabase
      .channel('mcard-reviews-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mcard_reviews',
        filter: `mcard_id=eq.${mcard.id}`
      }, () => {
        refreshData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(statusesChannel);
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(reviewsChannel);
    };
  }, [mcard, slug, refreshData]);
};
