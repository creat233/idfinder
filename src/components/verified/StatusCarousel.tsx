import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MCard, MCardStatus } from '@/types/mcard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { URL_CONFIG } from '@/utils/urlConfig';
import { StatusImageModal } from '@/components/mcards/view/StatusImageModal';

interface MCardWithStatus extends MCard {
  statuses: MCardStatus[];
}

interface StatusCarouselProps {
  onImageClick?: (status: MCardStatus, mcard: MCard) => void;
}

export const StatusCarousel = ({ onImageClick }: StatusCarouselProps) => {
  const [mcards, setMCards] = useState<MCardWithStatus[]>([]);
  const [currentStatusIndex, setCurrentStatusIndex] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMCardsWithStatuses();
  }, []);

  useEffect(() => {
    // Auto-slide pour chaque carte toutes les 4 secondes
    const intervals: { [key: string]: NodeJS.Timeout } = {};
    
    mcards.forEach(mcard => {
      if (mcard.statuses.length > 1) {
        intervals[mcard.id] = setInterval(() => {
          setCurrentStatusIndex(prev => ({
            ...prev,
            [mcard.id]: ((prev[mcard.id] || 0) + 1) % mcard.statuses.length
          }));
        }, 4000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [mcards]);

  const loadMCardsWithStatuses = async () => {
    try {
      // Charger toutes les cartes vérifiées et publiées (sans restriction d'abonnement)
      const { data: mcardsData, error: mcardsError } = await supabase
        .from('mcards')
        .select('*')
        .eq('is_published', true)
        .eq('is_verified', true)
        .order('view_count', { ascending: false })
        .limit(15);

      if (mcardsError) throw mcardsError;

      if (!mcardsData || mcardsData.length === 0) {
        setLoading(false);
        return;
      }

      // Charger les statuts pour chaque carte
      const mcardsWithStatuses = await Promise.all(
        mcardsData.map(async (mcard) => {
          const { data: statuses } = await supabase
            .from('mcard_statuses')
            .select('*')
            .eq('mcard_id', mcard.id)
            .not('status_image', 'is', null)
            .gte('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(3);

          return {
            ...mcard,
            statuses: statuses || []
          };
        })
      );

      // Filtrer seulement les cartes qui ont des statuts avec images
      const mcardsWithValidStatuses = mcardsWithStatuses.filter(mcard => mcard.statuses.length > 0);
      
      setMCards(mcardsWithValidStatuses);
      
      // Initialiser les index des statuts
      const initialIndexes: { [key: string]: number } = {};
      mcardsWithValidStatuses.forEach(mcard => {
        initialIndexes[mcard.id] = 0;
      });
      setCurrentStatusIndex(initialIndexes);
      
    } catch (error) {
      console.error('Erreur lors du chargement des statuts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevStatus = (mcardId: string, statusCount: number) => {
    setCurrentStatusIndex(prev => ({
      ...prev,
      [mcardId]: prev[mcardId] === 0 ? statusCount - 1 : prev[mcardId] - 1
    }));
  };

  const handleNextStatus = (mcardId: string, statusCount: number) => {
    setCurrentStatusIndex(prev => ({
      ...prev,
      [mcardId]: (prev[mcardId] + 1) % statusCount
    }));
  };

  const handleProfileClick = (slug: string) => {
    const url = URL_CONFIG.getMCardUrl(slug);
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (mcards.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 px-0 w-full mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-white flex items-center gap-3">
          <span className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-sm">📱</span>
          </span>
          Stories
        </h2>
        <div className="text-sm text-white/60 bg-white/10 px-3 py-1.5 rounded-full">
          {mcards.length} live
        </div>
      </div>
      
      {/* Stories horizontales style TikTok */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory scroll-smooth">
          {mcards.map((mcard) => {
            const currentIndex = currentStatusIndex[mcard.id] || 0;
            const currentStatus = mcard.statuses[currentIndex];
            
            return (
              <div 
                key={mcard.id} 
                className="flex-none w-28 snap-start group cursor-pointer"
                onClick={() => handleProfileClick(mcard.slug)}
              >
                {/* Story circle style TikTok */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                      <StatusImageModal
                        imageUrl={currentStatus.status_image || ''}
                        statusText={currentStatus.status_text}
                      >
                        <img
                          src={currentStatus.status_image || ''}
                          alt={currentStatus.status_text}
                          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                          loading="lazy"
                        />
                      </StatusImageModal>
                    </div>
                  </div>
                  
                  {/* Indicateur live */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Progress bars pour multiples stories */}
                  {mcard.statuses.length > 1 && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                      {mcard.statuses.map((_, index) => (
                        <div
                          key={index}
                          className={`h-0.5 rounded-full transition-all duration-300 ${
                            index === currentIndex 
                              ? 'bg-white w-4' 
                              : 'bg-white/40 w-2'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Nom en dessous */}
                <div className="mt-2">
                  <p className="text-xs text-white/90 text-center font-medium truncate">
                    {mcard.full_name?.split(' ')[0] || 'User'}
                  </p>
                </div>
              </div>
            );
          })}
          
          {/* Espace pour le scroll */}
          <div className="flex-none w-4"></div>
        </div>
        
        {/* Indicateur de scroll */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-white via-white to-transparent w-8 h-full pointer-events-none"></div>
      </div>
    </div>
  );
};