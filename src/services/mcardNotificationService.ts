import { supabase } from '@/integrations/supabase/client';

export const createStatusNotification = async (
  mcardId: string,
  mcardName: string,
  statusText: string
) => {
  try {
    // Get all users who have favorited this mcard (excluding the owner)
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: favoritedBy } = await supabase
      .from('mcard_favorites')
      .select('user_id')
      .eq('mcard_id', mcardId)
      .neq('user_id', user?.id || ''); // Exclude the owner

    if (!favoritedBy || favoritedBy.length === 0) {
      console.log('No users to notify for new status');
      return;
    }

    // Create notifications for each user
    const notifications = favoritedBy.map(fav => ({
      user_id: fav.user_id,
      type: 'new_status',
      title: 'Nouveau statut publié',
      message: `${mcardName} a publié un nouveau statut : "${statusText}"`,
      action_url: `/mcard/${mcardId}`,
    }));

    const { error } = await supabase.from('notifications').insert(notifications);
    
    if (error) {
      console.error('Error inserting notifications:', error);
    } else {
      console.log(`✅ ${notifications.length} notification(s) de statut envoyée(s)`);
    }
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
    // Get all users who have favorited this mcard (excluding the owner)
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: favoritedBy } = await supabase
      .from('mcard_favorites')
      .select('user_id')
      .eq('mcard_id', mcardId)
      .neq('user_id', user?.id || ''); // Exclude the owner

    if (!favoritedBy || favoritedBy.length === 0) {
      console.log('No users to notify for new product');
      return;
    }

    // Create notifications for each user
    const notifications = favoritedBy.map(fav => ({
      user_id: fav.user_id,
      type: 'new_product',
      title: 'Nouveau produit/service',
      message: `${mcardName} a ajouté un nouveau produit/service : "${productName}"`,
      action_url: `/mcard/${mcardId}`,
    }));

    const { error } = await supabase.from('notifications').insert(notifications);
    
    if (error) {
      console.error('Error inserting notifications:', error);
    } else {
      console.log(`✅ ${notifications.length} notification(s) de produit envoyée(s)`);
    }
  } catch (error) {
    console.error('Error creating product notification:', error);
  }
};
