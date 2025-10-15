import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MCard } from '@/types/mcard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface StatusWithMCard {
  id: string;
  status_text: string;
  status_image: string | null;
  status_color: string;
  created_at: string;
  expires_at: string;
  mcard: MCard;
}

export const UnverifiedStatusCarousel = () => {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<StatusWithMCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('mcard_statuses')
        .select(`
          *,
          mcard:mcards!inner(*)
        `)
        .eq('is_active', true)
        .eq('mcards.is_published', true)
        .eq('mcards.subscription_status', 'active')
        .eq('mcards.is_verified', false) // Uniquement les statuts des cartes NON vérifiées
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedStatuses = data?.map(status => ({
        ...status,
        mcard: status.mcard as MCard
      })) || [];

      setStatuses(formattedStatuses);
    } catch (error) {
      console.error('Erreur lors du chargement des statuts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = (status: StatusWithMCard) => {
    navigate(`/mcard/${status.mcard.slug}`);
  };

  if (loading || statuses.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto px-4 py-4">
      <div className="flex gap-4 pb-2">
        {statuses.map((status) => (
          <div
            key={status.id}
            onClick={() => handleStatusClick(status)}
            className="flex-shrink-0 cursor-pointer group"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500">
                  <Avatar className="w-full h-full border-2 border-slate-900">
                    <AvatarImage src={status.mcard.profile_picture_url || ''} />
                    <AvatarFallback className="text-white bg-gradient-to-br from-indigo-500 to-purple-500 font-bold">
                      {status.mcard.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NN'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs text-white/80 max-w-[64px] truncate">
                {status.mcard.full_name?.split(' ')[0] || 'Anonyme'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
