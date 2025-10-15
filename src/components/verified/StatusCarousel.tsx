import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MCard, MCardStatus } from '@/types/mcard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { StatusImageModal } from '@/components/mcards/view/StatusImageModal';

interface MCardWithStatus extends MCard {
  statuses: MCardStatus[];
}

interface StatusCarouselProps {
  onImageClick?: (status: MCardStatus, mcard: MCard) => void;
}

export const StatusCarousel = ({ onImageClick }: StatusCarouselProps) => {
  const navigate = useNavigate();
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
      // Charger TOUTES les cartes actives et publiées (vérifiées ET non vérifiées)
      const { data: mcardsData, error: mcardsError } = await supabase
        .from('mcards')
        .select('*')
        .eq('is_published', true)
        .eq('subscription_status', 'active')
        .order('view_count', { ascending: false })
        .limit(30);

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
    navigate(`/mcard/${slug}`);
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
    <div className="mb-8 px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Stories
        </h2>
      </div>
      
      {/* Stories horizontales - Design professionnel */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth px-2">
          {mcards.map((mcard) => {
            const currentIndex = currentStatusIndex[mcard.id] || 0;
            const currentStatus = mcard.statuses[currentIndex];
            
            return (
              <div 
                key={mcard.id} 
                className="flex-none snap-start group cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => handleProfileClick(mcard.slug)}
              >
                {/* Story circle avec gradient moderne */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-[3px] shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center border-2 border-slate-800">
                      <StatusImageModal
                        imageUrl={currentStatus.status_image || ''}
                        statusText={currentStatus.status_text}
                      >
                        <img
                          src={currentStatus.status_image || ''}
                          alt={currentStatus.status_text}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                          loading="lazy"
                        />
                      </StatusImageModal>
                    </div>
                  </div>
                  
                  
                  {/* Progress bars élégants pour multiples stories */}
                  {mcard.statuses.length > 1 && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {mcard.statuses.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 rounded-full transition-all duration-500 ${
                            index === currentIndex 
                              ? 'bg-gradient-to-r from-pink-400 to-purple-400 w-6 shadow-lg shadow-purple-500/50' 
                              : 'bg-white/30 w-3'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Nom professionnel en dessous */}
                <div className="mt-3">
                  <p className="text-sm text-white font-semibold text-center truncate max-w-[96px] drop-shadow-lg">
                    {mcard.full_name?.split(' ')[0] || 'User'}
                  </p>
                </div>
              </div>
            );
          })}
          
          {/* Espace pour le scroll */}
          <div className="flex-none w-4"></div>
        </div>
        
      </div>
    </div>
  );
};