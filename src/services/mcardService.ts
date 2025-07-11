
import { supabase } from '@/integrations/supabase/client';
import { MCard, MCardCreateData, MCardUpdateData } from '@/types/mcard';

const uploadProfilePicture = async (file: File, userId: string): Promise<string | null> => {
  const fileName = `${userId}-${Date.now()}.${file.name.split('.').pop()}`;
  const filePath = `${userId}/${fileName}`;

  const { error } = await supabase.storage
    .from('mcard-profile-pictures')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading profile picture:', error);
    throw new Error(`Erreur lors de l'upload de la photo: ${error.message}`);
  }

  const { data } = supabase.storage
    .from('mcard-profile-pictures')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

const deleteProfilePicture = async (url: string): Promise<void> => {
  if (!url) return;
  
  try {
    // Extraire le chemin du fichier depuis l'URL
    const urlParts = url.split('/storage/v1/object/public/mcard-profile-pictures/');
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      
      const { error } = await supabase.storage
        .from('mcard-profile-pictures')
        .remove([filePath]);
        
      if (error) {
        console.error('Error deleting profile picture:', error);
      }
    }
  } catch (error) {
    console.error('Error parsing profile picture URL:', error);
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
  // Vérifier la limite de 3 cartes par utilisateur
  const { data: existingCards, error: countError } = await supabase
    .from('mcards')
    .select('id')
    .eq('user_id', userId);

  if (countError) throw countError;

  if (existingCards && existingCards.length >= 3) {
    throw new Error('Limite atteinte : Vous ne pouvez créer que 3 cartes de visite maximum par compte.');
  }

  let profilePictureUrl = null;

  if (profilePictureFile) {
    profilePictureUrl = await uploadProfilePicture(profilePictureFile, userId);
  }

  // Logique pour les plans payants uniquement
  let subscriptionStatus = 'pending_payment';
  let isPublished = false;
  let subscriptionExpiresAt = null;

  // Toutes les cartes sont maintenant payantes et en attente de paiement
  if (mcardData.plan === 'essential' || mcardData.plan === 'premium') {
    subscriptionStatus = 'pending_payment';
    isPublished = false; // Inactive jusqu'à confirmation de paiement
  }

  const { data, error } = await supabase
    .from('mcards')
    .insert({
      ...mcardData,
      user_id: userId,
      profile_picture_url: profilePictureUrl,
      subscription_status: subscriptionStatus,
      is_published: isPublished,
      subscription_expires_at: subscriptionExpiresAt?.toISOString(),
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
  const { data, error } = await supabase
    .from('mcards')
    .update({ 
      plan: plan,
      subscription_status: 'pending_payment',
      is_published: false, // Désactiver la carte jusqu'à confirmation de paiement
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
