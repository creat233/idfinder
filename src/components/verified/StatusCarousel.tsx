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
      // Charger les cartes vérifiées
      const { data: mcardsData, error: mcardsError } = await supabase
        .from('mcards')
        .select('*')
        .eq('is_published', true)
        .eq('is_verified', true)
        .eq('subscription_status', 'active')
        .order('view_count', { ascending: false })
        .limit(8);

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
    <div className="mb-12 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Statuts Récents
        </h2>
        <div className="text-sm text-gray-500">
          {mcards.length} profils actifs
        </div>
      </div>
      
      {/* Carousel horizontal avec scroll */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth">
          {mcards.map((mcard) => {
            const currentIndex = currentStatusIndex[mcard.id] || 0;
            const currentStatus = mcard.statuses[currentIndex];
            
            return (
              <div 
                key={mcard.id} 
                className="flex-none w-80 bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-100 snap-start animate-fade-in hover-scale"
              >
                {/* Section Image du statut - Format story */}
                <div className="relative h-96 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                  <StatusImageModal
                    imageUrl={currentStatus.status_image || ''}
                    statusText={currentStatus.status_text}
                  >
                    <img
                      src={currentStatus.status_image || ''}
                      alt={currentStatus.status_text}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                      loading="lazy"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </StatusImageModal>
                  
                  {/* Overlay gradient élégant */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                  
                  {/* Navigation des statuts - coins arrondis */}
                  {mcard.statuses.length > 1 && (
                    <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        className="bg-white/90 hover:bg-white shadow-xl rounded-full p-3 h-12 w-12 flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevStatus(mcard.id, mcard.statuses.length);
                        }}
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        className="bg-white/90 hover:bg-white shadow-xl rounded-full p-3 h-12 w-12 flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextStatus(mcard.id, mcard.statuses.length);
                        }}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </div>
                  )}
                  
                  {/* Indicateurs de pagination stylés */}
                  {mcard.statuses.length > 1 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {mcard.statuses.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            index === currentIndex 
                              ? 'bg-white shadow-lg w-8' 
                              : 'bg-white/50 w-4'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Badge du statut avec style premium */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1 shadow-lg">
                      Story
                    </Badge>
                  </div>
                  
                  {/* Info statut en overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-sm font-medium leading-tight line-clamp-2 drop-shadow-lg">
                      {currentStatus.status_text}
                    </p>
                  </div>
                </div>
                
                {/* Section profil compact */}
                <div className="p-4">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl p-2 -m-2 transition-all duration-200"
                    onClick={() => handleProfileClick(mcard.slug)}
                  >
                    <Avatar className="h-12 w-12 ring-2 ring-gradient-to-r ring-purple-200 shadow-lg">
                      <AvatarImage src={mcard.profile_picture_url || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold text-lg">
                        {mcard.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors text-lg">
                        {mcard.full_name}
                      </h3>
                      {mcard.job_title && (
                        <p className="text-sm text-gray-600 truncate font-medium">{mcard.job_title}</p>
                      )}
                      {mcard.company && (
                        <p className="text-xs text-gray-500 truncate">{mcard.company}</p>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      {mcard.is_verified && (
                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-1">
                          ✓ Vérifié
                        </Badge>
                      )}
                    </div>
                  </div>
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