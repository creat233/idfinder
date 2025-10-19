import { supabase } from '@/integrations/supabase/client';

export const createStatusNotification = async (
  mcardId: string,
  mcardName: string,
  statusText: string
) => {
  try {
    // Get all users who have favorited or interacted with this mcard
    const { data: favoritedBy } = await supabase
      .from('mcard_favorites')
      .select('user_id')
      .eq('mcard_id', mcardId);

    if (!favoritedBy || favoritedBy.length === 0) return;

    // Create notifications for each user
    const notifications = favoritedBy.map(fav => ({
      user_id: fav.user_id,
      type: 'new_status',
      title: 'Nouveau statut publié',
      message: `${mcardName} a publié un nouveau statut : ${statusText}`,
      action_url: `/mcard/${mcardId}`,
    }));

    await supabase.from('notifications').insert(notifications);
  } catch (error) {
    console.error('Error creating status notification:', error);
  }
};

export const createProductNotification = async (
  mcardId: string,
  mcardName: string,
  productName: string
) => {
  try {
    // Get all users who have favorited or interacted with this mcard
    const { data: favoritedBy } = await supabase
      .from('mcard_favorites')
      .select('user_id')
      .eq('mcard_id', mcardId);

    if (!favoritedBy || favoritedBy.length === 0) return;

    // Create notifications for each user
    const notifications = favoritedBy.map(fav => ({
      user_id: fav.user_id,
      type: 'new_product',
      title: 'Nouveau produit/service',
      message: `${mcardName} a ajouté un nouveau produit : ${productName}`,
      action_url: `/mcard/${mcardId}`,
    }));

    await supabase.from('notifications').insert(notifications);
  } catch (error) {
    console.error('Error creating product notification:', error);
  }
};
