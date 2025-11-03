import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMCardInteractions } from '@/hooks/useMCardInteractions';
import { motion } from 'framer-motion';
import { offlineStorage } from '@/services/offlineStorage';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  mcardId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  allowOffline?: boolean;
}

export const FavoriteButton = ({ 
  mcardId, 
  className = "", 
  size = 'md',
  showText = false,
  allowOffline = true
}: FavoriteButtonProps) => {
  const { isFavorited, handleFavorite, loading } = useMCardInteractions(mcardId);
  const { toast } = useToast();

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Si hors ligne et autorisé, sauvegarder localement
    if (allowOffline && !navigator.onLine) {
      toast({
        title: "Mode hors ligne",
        description: "Le favori sera synchronisé lors de la prochaine connexion"
      });
      // Sauvegarder l'action en attente
      offlineStorage.addPendingChange({
        type: 'mcard',
        action: isFavorited ? 'delete' : 'create',
        data: { mcardId, action: 'favorite' }
      });
      return;
    }
    
    await handleFavorite();
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size={showText ? "sm" : "icon"}
      onClick={handleClick}
      disabled={loading}
      className={`
        ${showText ? '' : sizeClasses[size]}
        ${isFavorited 
          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-amber-500 shadow-lg' 
          : 'border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
        }
        transition-all duration-300 hover:scale-105 active:scale-95
        ${className}
      `}
    >
      <motion.div
        animate={{ 
          scale: isFavorited ? [1, 1.3, 1] : 1,
          rotate: isFavorited ? [0, 15, -15, 0] : 0
        }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
      >
        <Star 
          className={`${iconSizes[size]} ${isFavorited ? 'fill-current drop-shadow-sm' : ''}`} 
        />
      </motion.div>
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isFavorited ? '⭐ Favori' : '🌟 Ajouter'}
        </span>
      )}
    </Button>
  );
};