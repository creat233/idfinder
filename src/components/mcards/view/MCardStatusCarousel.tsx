import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Edit, Share2, Send, Sparkles, ChevronLeft, ChevronRight, Heart, MessageCircle } from 'lucide-react';
import { MCardStatus } from '@/types/mcard';
import { StatusImageModal } from './StatusImageModal';
import { useToast } from '@/hooks/use-toast';
import { FavoriteButton } from '@/components/favorites/FavoriteButton';
import { useMCardInteractions } from '@/hooks/useMCardInteractions';

interface MCardStatusCarouselProps {
  statuses: MCardStatus[];
  isOwner?: boolean;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onStatusClick: (status: MCardStatus) => void;
  onEditStatus: (status: MCardStatus) => void;
  onShareStatus: (status: MCardStatus) => void;
  onContactOwner: (status: MCardStatus) => void;
  mcardId?: string;
}

export const MCardStatusCarousel = ({
  statuses,
  isOwner,
  currentIndex,
  onIndexChange,
  onStatusClick,
  onEditStatus,
  onShareStatus,
  onContactOwner,
  mcardId = ""
}: MCardStatusCarouselProps) => {
  const { toast } = useToast();
  const { handleLike, isLiked, likesCount } = useMCardInteractions(mcardId);

  if (statuses.length === 0) return null;

  const currentStatus = statuses[currentIndex];
  const hasMultipleStatuses = statuses.length > 1;

  const nextStatus = () => {
    onIndexChange((currentIndex + 1) % statuses.length);
  };

  const prevStatus = () => {
    onIndexChange(currentIndex === 0 ? statuses.length - 1 : currentIndex - 1);
  };

  const timeRemaining = currentStatus.expires_at ? 
    Math.max(0, Math.floor((new Date(currentStatus.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60))) : 
    null;

  if (isOwner) {
    // Design pour le propriétaire - affichage en liste séparée
    return (
      <div className="space-y-6">
        {statuses.map((status, index) => {
          const timeRemaining = status.expires_at ? 
            Math.max(0, Math.floor((new Date(status.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60))) : 
            null;

          return (
            <div 
              key={status.id}
              className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl p-6 border border-white/60 backdrop-blur-sm overflow-hidden"
            >
              {/* Main content */}
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Status image */}
                {status.status_image && (
                  <StatusImageModal 
                    imageUrl={status.status_image}
                    statusText={status.status_text}
                    allStatuses={statuses}
                    currentStatusId={status.id}
                  >
                    <div className="relative group flex-shrink-0 mx-auto lg:mx-0">
                      <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500">
                        <img 
                          src={status.status_image} 
                          alt={status.status_text}
                          className="w-full lg:w-48 h-64 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            console.error('Error loading status image:', status.status_image);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                            <span className="text-white text-sm font-medium">Cliquer pour agrandir</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </StatusImageModal>
                )}
                
                {/* Status content */}
                <div className="flex-1 space-y-6">
                  {/* Badge with status text */}
                  <div className="flex items-center justify-center lg:justify-start">
                    <Badge 
                      className="text-white font-bold cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg text-lg px-6 py-3 rounded-full border-2 border-white/30"
                      style={{ 
                        backgroundColor: status.status_color,
                        background: `linear-gradient(135deg, ${status.status_color}, ${status.status_color}dd)`
                      }}
                      onClick={() => onStatusClick(status)}
                    >
                      <Sparkles className="w-5 h-5 mr-3 animate-pulse" />
                      {status.status_text}
                    </Badge>
                  </div>
                  
                  {/* Time remaining */}
                  {timeRemaining !== null && (
                    <div className="flex items-center justify-center lg:justify-start gap-3 text-sm text-gray-600 bg-white/80 rounded-xl px-4 py-3 w-fit mx-auto lg:mx-0 shadow-sm">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">
                        {timeRemaining > 0 
                          ? `Expire dans ${timeRemaining}h`
                          : 'Expiré'
                        }
                      </span>
                    </div>
                  )}

                  {/* Interaction buttons */}
                  <div className="flex items-center gap-4 pt-4 justify-center lg:justify-start">
                    {/* J'aime button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleLike}
                      className="flex items-center gap-2 hover:scale-105 transition-all duration-300 bg-white/80 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-xl px-4 py-2"
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-red-500'}`} />
                      <span className="text-sm font-medium text-red-600">{likesCount}</span>
                    </Button>

                    {/* Share button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onShareStatus(status)}
                      className="flex items-center gap-2 hover:scale-105 transition-all duration-300 bg-white/80 hover:bg-green-50 border border-green-200 hover:border-green-300 rounded-xl px-4 py-2"
                    >
                      <Share2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Partager</span>
                    </Button>

                    {/* Edit button for owner */}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onEditStatus(status)}
                      className="flex items-center gap-2 hover:scale-105 transition-all duration-300 bg-white/80 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2"
                    >
                      <Edit className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Modifier</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    // Design moderne et professionnel pour les visiteurs
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Statuts Récents
          </h2>
          <Badge variant="outline" className="text-sm font-semibold border-primary/30 text-primary">
            {statuses.length} statut{statuses.length > 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statuses.map((status, index) => {
            const timeRemaining = status.expires_at ? 
              Math.max(0, Math.floor((new Date(status.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60))) : 
              null;

            return (
              <div 
                key={status.id} 
                className="group relative bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-primary/20 hover:-translate-y-1"
              >
                {/* Image du statut avec overlay élégant */}
                <div className="relative h-72 overflow-hidden">
                  {status.status_image ? (
                    <StatusImageModal 
                      imageUrl={status.status_image}
                      statusText={status.status_text}
                      allStatuses={statuses}
                      currentStatusId={status.id}
                      onNavigate={(statusId) => {
                        const newIndex = statuses.findIndex(s => s.id === statusId);
                        if (newIndex !== -1) onIndexChange(newIndex);
                      }}
                    >
                      <div className="relative h-full cursor-pointer">
                        <img 
                          src={status.status_image} 
                          alt={status.status_text}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            console.error('Error loading status image:', status.status_image);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        {/* Gradient overlay sophistiqué */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                        
                        {/* Effet de brillance au hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      </div>
                    </StatusImageModal>
                  ) : (
                    <div 
                      className="relative h-full flex items-center justify-center cursor-pointer"
                      style={{ 
                        background: `linear-gradient(135deg, ${status.status_color}ee, ${status.status_color}cc, ${status.status_color}aa)`
                      }}
                      onClick={() => onStatusClick(status)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
                      <Sparkles className="w-16 h-16 text-white/90 animate-pulse drop-shadow-2xl" />
                    </div>
                  )}

                  {/* Badge de temps restant - position élégante */}
                  {timeRemaining !== null && (
                    <div className="absolute top-4 right-4">
                      <Badge 
                        className="bg-black/60 backdrop-blur-md text-white border-0 px-3 py-1.5 rounded-full shadow-xl font-medium"
                      >
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        {timeRemaining > 0 ? `${timeRemaining}h` : 'Expiré'}
                      </Badge>
                    </div>
                  )}

                  {/* Texte du statut avec typographie premium */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge 
                      className="text-white font-bold text-base px-5 py-2.5 rounded-2xl shadow-2xl mb-3 border-2 border-white/20 backdrop-blur-sm max-w-full"
                      style={{ 
                        backgroundColor: `${status.status_color}ee`,
                        background: `linear-gradient(135deg, ${status.status_color}ee, ${status.status_color}cc)`
                      }}
                    >
                      <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{status.status_text}</span>
                    </Badge>
                  </div>
                </div>

                {/* Section interactions moderne */}
                <div className="p-5 bg-gradient-to-br from-gray-50/80 to-white/90 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-2">
                    {/* Bouton J'aime avec animation */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleLike}
                      className="flex items-center gap-2 hover:scale-110 transition-all duration-300 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md flex-1"
                    >
                      <Heart className={`h-4 w-4 transition-all ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600'}`} />
                      <span className={`text-sm font-semibold ${isLiked ? 'text-red-600' : 'text-gray-700'}`}>
                        {likesCount || 0}
                      </span>
                    </Button>

                    {/* Bouton Message élégant */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onContactOwner(status)}
                      className="flex items-center gap-2 hover:scale-110 transition-all duration-300 bg-white hover:bg-primary/10 border border-gray-200 hover:border-primary/30 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md flex-1"
                    >
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-gray-700">Message</span>
                    </Button>

                    {/* Bouton Partager premium */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onShareStatus(status)}
                      className="flex items-center gap-2 hover:scale-110 transition-all duration-300 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-xl p-2.5 shadow-sm hover:shadow-md"
                    >
                      <Share2 className="h-4 w-4 text-green-600" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};