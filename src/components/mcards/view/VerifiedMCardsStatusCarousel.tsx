import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MCardStatus } from '@/types/mcard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StatusWithMCard extends MCardStatus {
  mcard: {
    id: string;
    full_name: string;
    slug: string;
    profile_picture_url?: string;
  };
}

interface VerifiedMCardsStatusCarouselProps {
  onStatusClick?: (status: StatusWithMCard) => void;
}

export const VerifiedMCardsStatusCarousel = ({ onStatusClick }: VerifiedMCardsStatusCarouselProps) => {
  const [allStatuses, setAllStatuses] = useState<StatusWithMCard[]>([]);
  const [currentStatusIndex, setCurrentStatusIndex] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const intervalRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    loadAllStatuses();
  }, []);

  useEffect(() => {
    // Démarrer l'auto-play pour chaque groupe de statuts
    allStatuses.forEach(status => {
      const mcardId = status.mcard.id;
      const mcardStatuses = allStatuses.filter(s => s.mcard.id === mcardId);
      
      if (mcardStatuses.length > 1) {
        startAutoPlay(mcardId, mcardStatuses.length);
      }
    });

    return () => {
      // Nettoyer tous les intervals
      Object.values(intervalRefs.current).forEach(interval => clearInterval(interval));
    };
  }, [allStatuses]);

  const startAutoPlay = (mcardId: string, statusCount: number) => {
    if (intervalRefs.current[mcardId]) {
      clearInterval(intervalRefs.current[mcardId]);
    }

    intervalRefs.current[mcardId] = setInterval(() => {
      setCurrentStatusIndex(prev => ({
        ...prev,
        [mcardId]: ((prev[mcardId] || 0) + 1) % statusCount
      }));
    }, 700); // 0.7 secondes
  };

  const loadAllStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('mcard_statuses')
        .select(`
          *,
          mcard:mcards!inner(
            id,
            full_name,
            slug,
            profile_picture_url
          )
        `)
        .eq('is_active', true)
        .eq('mcard.is_published', true)
        .eq('mcard.is_verified', true)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAllStatuses(data as StatusWithMCard[]);
    } catch (error) {
      console.error('Erreur lors du chargement des statuts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Grouper les statuts par carte
  const statusesByCard = allStatuses.reduce((acc, status) => {
    const mcardId = status.mcard.id;
    if (!acc[mcardId]) {
      acc[mcardId] = [];
    }
    acc[mcardId].push(status);
    return acc;
  }, {} as { [key: string]: StatusWithMCard[] });

  const handleStatusClick = (status: StatusWithMCard) => {
    onStatusClick?.(status);
    // Ouvrir la carte dans un nouvel onglet
    window.open(`/mcard/${status.mcard.slug}`, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mx-2 sm:mx-0 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex space-x-4 overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-none">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (Object.keys(statusesByCard).length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-2 sm:mx-0 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
          🟢 Statuts & Disponibilités
        </h3>
      </div>

      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {Object.entries(statusesByCard).map(([mcardId, statuses]) => {
              const currentIndex = currentStatusIndex[mcardId] || 0;
              const currentStatus = statuses[currentIndex];
              
              return (
                <CarouselItem key={mcardId} className="pl-2 md:pl-4 basis-auto">
                  <div 
                    className="flex flex-col items-center space-y-3 cursor-pointer group"
                    onClick={() => handleStatusClick(currentStatus)}
                  >
                    {/* Image ronde du statut */}
                    <div className="relative">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-gradient-primary shadow-lg group-hover:scale-105 transition-transform duration-200">
                        {currentStatus.status_image ? (
                          <img
                            src={currentStatus.status_image}
                            alt={currentStatus.status_text}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: currentStatus.status_color || '#3B82F6' }}
                          >
                            {currentStatus.status_text.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      {/* Indicateur de nombre de statuts */}
                      {statuses.length > 1 && (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {statuses.length}
                        </div>
                      )}
                    </div>

                    {/* Badge avec le statut */}
                    <Badge 
                      className="text-xs px-3 py-1 max-w-[100px] truncate"
                      style={{ 
                        backgroundColor: currentStatus.status_color || '#3B82F6',
                        color: 'white'
                      }}
                    >
                      {currentStatus.status_text}
                    </Badge>

                    {/* Nom de la carte */}
                    <p className="text-sm font-medium text-gray-700 text-center max-w-[100px] truncate">
                      {currentStatus.mcard.full_name}
                    </p>

                    {/* Indicateurs de statuts multiples */}
                    {statuses.length > 1 && (
                      <div className="flex space-x-1">
                        {statuses.map((_, index) => (
                          <div
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                              index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>

        {/* Navigation mobile */}
        <div className="flex md:hidden justify-center mt-4 space-x-4">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};