import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMCardInteractions } from '@/hooks/useMCardInteractions';
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
  const { isFavorited, handleFavorite, loading } = useMCardInteractions(mcardId);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
          ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-pink-500 shadow-lg' 
          : 'border-pink-200 text-pink-500 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600'
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
        <Heart 
          className={`${iconSizes[size]} ${isFavorited ? 'fill-current drop-shadow-sm' : ''}`} 
        />
      </motion.div>
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isFavorited ? '❤️ Favori' : '🤍 Ajouter'}
        </span>
      )}
    </Button>
  );
};