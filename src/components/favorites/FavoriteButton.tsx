import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { motion } from 'framer-motion';

interface FavoriteButtonProps {
  mcardId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const FavoriteButton = ({ 
  mcardId, 
  className = "", 
  size = 'md',
  showText = false
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const isInFavorites = isFavorite(mcardId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(mcardId);
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
      variant={isInFavorites ? "default" : "outline"}
      size={showText ? "sm" : "icon"}
      onClick={handleClick}
      disabled={loading}
      className={`
        ${showText ? '' : sizeClasses[size]}
        ${isInFavorites 
          ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
          : 'border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300'
        }
        transition-all duration-300 hover:scale-105 active:scale-95
        ${className}
      `}
    >
      <motion.div
        animate={{ 
          scale: isInFavorites ? [1, 1.2, 1] : 1,
          rotate: isInFavorites ? [0, 10, -10, 0] : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`${iconSizes[size]} ${isInFavorites ? 'fill-current' : ''}`} 
        />
      </motion.div>
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isInFavorites ? 'Favori' : 'Ajouter'}
        </span>
      )}
    </Button>
  );
};