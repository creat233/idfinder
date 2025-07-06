import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  toggleInteraction, 
  getUserInteractions, 
  getInteractionCounts 
} from '@/services/mcardInteractionService';

export const useMCardInteractions = (mcardId: string) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInteractions();
  }, [mcardId]);

  const loadInteractions = async () => {
    try {
      const [userInteractions, counts] = await Promise.all([
        getUserInteractions(mcardId),
        getInteractionCounts(mcardId)
      ]);

      setIsLiked(userInteractions.isLiked);
      setIsFavorited(userInteractions.isFavorited);
      setLikesCount(counts.likes);
      setFavoritesCount(counts.favorites);
    } catch (error) {
      console.error('Erreur lors du chargement des interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const result = await toggleInteraction(mcardId, 'like');
    
    if (result.success) {
      setIsLiked(result.isActive);
      setLikesCount(prev => result.isActive ? prev + 1 : prev - 1);
      
      toast({
        title: result.isActive ? "❤️ J'aime ajouté" : "❤️ J'aime retiré",
        description: result.isActive ? "Vous aimez cette carte" : "Vous n'aimez plus cette carte"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de traiter votre action"
      });
    }
  };

  const handleFavorite = async () => {
    const result = await toggleInteraction(mcardId, 'favorite');
    
    if (result.success) {
      setIsFavorited(result.isActive);
      setFavoritesCount(prev => result.isActive ? prev + 1 : prev - 1);
      
      toast({
        title: result.isActive ? "⭐ Ajouté aux favoris" : "⭐ Retiré des favoris",
        description: result.isActive ? "Carte ajoutée à vos favoris" : "Carte retirée de vos favoris"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de traiter votre action"
      });
    }
  };

  return {
    isLiked,
    isFavorited,
    likesCount,
    favoritesCount,
    loading,
    handleLike,
    handleFavorite,
    refresh: loadInteractions
  };
};