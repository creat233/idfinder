
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

    // Debounce très long pour éviter les rafraîchissements trop fréquents
    let refreshTimeout: NodeJS.Timeout;
    const debouncedRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        // Rafraîchissement silencieux seulement si nécessaire
        refreshData();
      }, 5000); // Attendre 5 secondes avant de rafraîchir
    };

    // Canal pour les statuts - rafraîchissement avec debounce
    const statusesChannel = supabase
      .channel(`mcard-statuses-${mcard.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mcard_statuses',
        filter: `mcard_id=eq.${mcard.id}`
      }, (payload) => {
        console.log('Status update received, scheduling silent refresh...');
        debouncedRefresh();
      })
      .subscribe();

    // Canal pour les produits - rafraîchissement avec debounce
    const productsChannel = supabase
      .channel(`mcard-products-${mcard.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mcard_products',
        filter: `mcard_id=eq.${mcard.id}`
      }, (payload) => {
        console.log('Product update received, scheduling silent refresh...');
        debouncedRefresh();
      })
      .subscribe();

    // Canal pour les avis - rafraîchissement avec debounce
    const reviewsChannel = supabase
      .channel(`mcard-reviews-${mcard.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mcard_reviews',
        filter: `mcard_id=eq.${mcard.id}`
      }, (payload) => {
        console.log('Review update received, scheduling silent refresh...');
        debouncedRefresh();
      })
      .subscribe();

    // Canal pour les vues - mise à jour instantanée et silencieuse (pas de refresh complet)
    const viewsChannel = supabase
      .channel(`mcard-views-${mcard.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'mcards',
        filter: `id=eq.${mcard.id}`
      }, (payload) => {
        if (payload.new && onViewCountUpdate) {
          const newViewCount = (payload.new as any).view_count;
          if (newViewCount !== undefined && newViewCount !== mcard.view_count) {
            console.log('View count updated silently:', newViewCount);
            onViewCountUpdate(newViewCount);
          }
        }
      })
      .subscribe();

    return () => {
      clearTimeout(refreshTimeout);
      supabase.removeChannel(statusesChannel);
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(reviewsChannel);
      supabase.removeChannel(viewsChannel);
    };
  }, [mcard?.id, slug, refreshData, onViewCountUpdate, mcard?.view_count]);
};
