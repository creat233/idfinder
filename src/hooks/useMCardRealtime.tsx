
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
      supabase.removeChannel(viewsChannel);
    };
  }, [mcard?.id, slug, onViewCountUpdate, mcard?.view_count]);
};
