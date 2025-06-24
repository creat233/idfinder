
import { supabase } from '@/integrations/supabase/client';
import { MCard, MCardCreateData, MCardUpdateData } from '@/types/mcard';

const uploadProfilePicture = async (file: File, userId: string): Promise<string | null> => {
  const fileName = `${userId}-${Date.now()}.${file.name.split('.').pop()}`;
  const filePath = `profile-pictures/${fileName}`;

  const { error } = await supabase.storage
    .from('mcard-profile-pictures')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading profile picture:', error);
    return null;
  }

  const { data } = supabase.storage
    .from('mcard-profile-pictures')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

const deleteProfilePicture = async (url: string): Promise<void> => {
  if (!url) return;
  
  const path = url.split('/').pop();
  if (path && path.includes('profile-pictures/')) {
    const filePath = path.substring(path.indexOf('profile-pictures/'));
    await supabase.storage
      .from('mcard-profile-pictures')
      .remove([filePath]);
  }
};

export const fetchMCards = async (userId: string): Promise<MCard[]> => {
  const { data, error } = await supabase
    .from('mcards')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createMCard = async (
  mcardData: MCardCreateData, 
  profilePictureFile: File | null, 
  userId: string
): Promise<MCard> => {
  let profilePictureUrl = null;

  if (profilePictureFile) {
    profilePictureUrl = await uploadProfilePicture(profilePictureFile, userId);
  }

  // Déterminer le prix basé sur le plan
  let price = 0;
  if (mcardData.plan === 'essential') {
    price = 2000;
  } else if (mcardData.plan === 'premium') {
    price = 10000;
  }

  // Déterminer le statut de souscription basé sur le plan
  let subscriptionStatus = 'active';
  if (mcardData.plan !== 'free') {
    subscriptionStatus = 'pending_payment';
  }

  const { data, error } = await supabase
    .from('mcards')
    .insert({
      ...mcardData,
      user_id: userId,
      profile_picture_url: profilePictureUrl,
      price: price,
      subscription_status: subscriptionStatus,
      is_published: mcardData.plan === 'free' ? true : false, // Les cartes payantes sont inactives jusqu'à confirmation
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMCard = async (
  id: string,
  mcardData: MCardUpdateData,
  profilePictureFile: File | null,
  originalCard: MCard,
  userId: string
): Promise<MCard> => {
  let profilePictureUrl = originalCard.profile_picture_url;

  if (profilePictureFile) {
    if (originalCard.profile_picture_url) {
      await deleteProfilePicture(originalCard.profile_picture_url);
    }
    profilePictureUrl = await uploadProfilePicture(profilePictureFile, userId);
  }

  const { data, error } = await supabase
    .from('mcards')
    .update({
      ...mcardData,
      profile_picture_url: profilePictureUrl,
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMCard = async (id: string, profilePictureUrl?: string | null): Promise<void> => {
  if (profilePictureUrl) {
    await deleteProfilePicture(profilePictureUrl);
  }

  const { error } = await supabase
    .from('mcards')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const requestPlanUpgrade = async (id: string, plan: 'essential' | 'premium'): Promise<MCard> => {
  // Déterminer le nouveau prix
  let price = 0;
  if (plan === 'essential') {
    price = 2000;
  } else if (plan === 'premium') {
    price = 10000;
  }

  const { data, error } = await supabase
    .from('mcards')
    .update({ 
      plan: plan,
      price: price,
      subscription_status: 'pending_payment',
      is_published: false, // Désactiver la carte jusqu'à confirmation de paiement
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
