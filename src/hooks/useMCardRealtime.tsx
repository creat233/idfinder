
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MCard } from '@/types/mcard';

interface UseMCardRealtimeProps {
  mcard: MCard | null;
  slug?: string;
  refreshData: () => void;
  onViewCountUpdate?: (newCount: number) => void;
}

export const useMCardRealtime = ({ mcard, slug, refreshData, onViewCountUpdate }: UseMCardRealtimeProps) => {
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

    // Canal pour les vues en temps réel
    const viewsChannel = supabase
      .channel('mcard-views-realtime')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'mcards',
        filter: `id=eq.${mcard.id}`
      }, (payload) => {
        if (payload.new && onViewCountUpdate) {
          const newViewCount = (payload.new as any).view_count;
          if (newViewCount !== undefined) {
            onViewCountUpdate(newViewCount);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(statusesChannel);
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(reviewsChannel);
      supabase.removeChannel(viewsChannel);
    };
  }, [mcard, slug, refreshData, onViewCountUpdate]);
};
