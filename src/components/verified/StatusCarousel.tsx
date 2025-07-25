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
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Statuts Récents
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
        {mcards.map((mcard) => {
          const currentIndex = currentStatusIndex[mcard.id] || 0;
          const currentStatus = mcard.statuses[currentIndex];
          
          return (
            <div key={mcard.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100">
              {/* Section Image du statut */}
              <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
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
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Navigation des statuts */}
                {mcard.statuses.length > 1 && (
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/80 hover:bg-white shadow-lg rounded-full p-2 h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevStatus(mcard.id, mcard.statuses.length);
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/80 hover:bg-white shadow-lg rounded-full p-2 h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextStatus(mcard.id, mcard.statuses.length);
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {/* Indicateurs de pagination */}
                {mcard.statuses.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {mcard.statuses.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                          index === currentIndex ? 'bg-white shadow-lg' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Badge du statut */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-purple-600/80 text-white text-xs">
                    Statut
                  </Badge>
                </div>
              </div>
              
              {/* Section profil du propriétaire */}
              <div className="p-4">
                <div 
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
                  onClick={() => handleProfileClick(mcard.slug)}
                >
                  <Avatar className="h-12 w-12 ring-2 ring-purple-100">
                    <AvatarImage src={mcard.profile_picture_url || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold">
                      {mcard.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                      {mcard.full_name}
                    </h3>
                    {mcard.job_title && (
                      <p className="text-sm text-gray-600 truncate">{mcard.job_title}</p>
                    )}
                    {mcard.company && (
                      <p className="text-xs text-gray-500 truncate">{mcard.company}</p>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <User className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </div>
                
                {/* Info statut */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-700 line-clamp-2">{currentStatus.status_text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};