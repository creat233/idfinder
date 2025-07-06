import { supabase } from '@/integrations/supabase/client';
import { MCardInteraction } from '@/types/mcard-verification';

export const toggleInteraction = async (
  mcardId: string,
  interactionType: 'like' | 'favorite'
): Promise<{ success: boolean; isActive: boolean }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    // Vérifier si l'interaction existe déjà
    const { data: existing } = await supabase
      .from('mcard_interactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('mcard_id', mcardId)
      .eq('interaction_type', interactionType)
      .single();

    if (existing) {
      // Supprimer l'interaction
      const { error } = await supabase
        .from('mcard_interactions')
        .delete()
        .eq('id', existing.id);

      if (error) throw error;
      return { success: true, isActive: false };
    } else {
      // Créer l'interaction
      const { error } = await supabase
        .from('mcard_interactions')
        .insert({
          user_id: user.id,
          mcard_id: mcardId,
          interaction_type: interactionType
        });

      if (error) throw error;
      return { success: true, isActive: true };
    }
  } catch (error: any) {
    console.error('Erreur lors de l\'interaction:', error);
    return { success: false, isActive: false };
  }
};

export const getUserInteractions = async (mcardId: string): Promise<{
  isLiked: boolean;
  isFavorited: boolean;
}> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { isLiked: false, isFavorited: false };

    const { data, error } = await supabase
      .from('mcard_interactions')
      .select('interaction_type')
      .eq('user_id', user.id)
      .eq('mcard_id', mcardId);

    if (error) throw error;

    const interactions = data || [];
    return {
      isLiked: interactions.some(i => i.interaction_type === 'like'),
      isFavorited: interactions.some(i => i.interaction_type === 'favorite')
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des interactions:', error);
    return { isLiked: false, isFavorited: false };
  }
};

export const getInteractionCounts = async (mcardId: string): Promise<{
  likes: number;
  favorites: number;
}> => {
  try {
    const { data: likes, error: likesError } = await supabase
      .from('mcard_interactions')
      .select('id', { count: 'exact' })
      .eq('mcard_id', mcardId)
      .eq('interaction_type', 'like');

    const { data: favorites, error: favoritesError } = await supabase
      .from('mcard_interactions')
      .select('id', { count: 'exact' })
      .eq('mcard_id', mcardId)
      .eq('interaction_type', 'favorite');

    if (likesError || favoritesError) {
      throw likesError || favoritesError;
    }

    return {
      likes: likes?.length || 0,
      favorites: favorites?.length || 0
    };
  } catch (error) {
    console.error('Erreur lors du comptage des interactions:', error);
    return { likes: 0, favorites: 0 };
  }
};

export const getFavoriteCards = async (): Promise<any[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('mcard_interactions')
      .select(`
        *,
        mcards (*)
      `)
      .eq('user_id', user.id)
      .eq('interaction_type', 'favorite')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(item => item.mcards).filter(Boolean) || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    return [];
  }
};