import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useLoyaltyActions } from '@/hooks/useLoyaltyActions';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface ProductLikeButtonProps {
  productId: string;
  mcardId: string;
  productName: string;
  size?: 'sm' | 'default';
  className?: string;
}

export const ProductLikeButton = ({ 
  productId, 
  mcardId, 
  productName,
  size = 'sm',
  className = ''
}: ProductLikeButtonProps) => {
  const { user } = useAuth();
  const { isActionCompleted, awardPoints, programActive } = useLoyaltyActions(mcardId);
  const { toast } = useToast();
  const [isLiking, setIsLiking] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const isLiked = isActionCompleted('product_like', productId);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour aimer ce produit et gagner des points fidélité !",
        variant: "destructive"
      });
      return;
    }

    if (isLiked) {
      toast({
        title: "Déjà aimé",
        description: "Vous avez déjà aimé ce produit"
      });
      return;
    }

    setIsLiking(true);
    setShowAnimation(true);

    try {
      const result = await awardPoints('product_like', productId);
      
      if (result.success) {
        toast({
          title: `❤️ ${productName} aimé !`,
          description: `+${result.pointsEarned} points de fidélité gagnés !`
        });
      } else if (result.message === 'Action déjà effectuée') {
        toast({
          title: "Produit déjà aimé",
          description: "Vous avez déjà aimé ce produit"
        });
      }
    } catch (error) {
      console.error('Error liking product:', error);
    } finally {
      setIsLiking(false);
      setTimeout(() => setShowAnimation(false), 600);
    }
  };

  // Don't show if program is not active
  if (!programActive) return null;

  return (
    <motion.div className="relative">
      <Button
        size={size}
        variant={isLiked ? "default" : "outline"}
        onClick={handleLike}
        disabled={isLiking || isLiked}
        className={`
          ${isLiked 
            ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
            : 'text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400'
          } 
          transition-all duration-200 active:scale-95
          ${className}
        `}
      >
        <Heart 
          className={`h-3.5 w-3.5 mr-1 ${isLiked ? 'fill-white' : ''}`} 
        />
        {isLiked ? 'Aimé' : 'J\'aime'}
      </Button>

      {/* Heart animation */}
      {showAnimation && (
        <motion.div
          initial={{ opacity: 1, scale: 0.5, y: 0 }}
          animate={{ opacity: 0, scale: 1.5, y: -30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <Heart className="h-6 w-6 text-red-500 fill-red-500" />
        </motion.div>
      )}
    </motion.div>
  );
};
