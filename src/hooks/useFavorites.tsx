import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUserFavorites();
  }, []);

  const loadUserFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('mcard_favorites')
        .select('mcard_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const favoriteIds = new Set(data?.map(fav => fav.mcard_id) || []);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (mcardId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Connexion requise",
          description: "Vous devez être connecté pour ajouter des favoris"
        });
        return false;
      }

      const isFavorite = favorites.has(mcardId);

      if (isFavorite) {
        // Supprimer des favoris
        const { error } = await supabase
          .from('mcard_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('mcard_id', mcardId);

        if (error) throw error;

        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(mcardId);
          return newFavorites;
        });

        toast({
          title: "Retiré des favoris",
          description: "Cette carte a été retirée de vos favoris"
        });
      } else {
        // Ajouter aux favoris
        const { error } = await supabase
          .from('mcard_favorites')
          .insert({
            user_id: user.id,
            mcard_id: mcardId
          });

        if (error) throw error;

        setFavorites(prev => new Set(prev).add(mcardId));

        toast({
          title: "Ajouté aux favoris ❤️",
          description: "Vous recevrez des notifications quand cette carte ajoute des produits"
        });
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les favoris"
      });
      return false;
    }
  };

  const isFavorite = (mcardId: string) => favorites.has(mcardId);

  const getFavoritesCount = () => favorites.size;

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
    refreshFavorites: loadUserFavorites
  };
};