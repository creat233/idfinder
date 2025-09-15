
import { supabase } from '@/integrations/supabase/client';
import { MCard, MCardCreateData, MCardUpdateData } from '@/types/mcard';
import { uploadProfilePicture, deleteProfilePicture } from './mcardProfileService';

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
  try {
    console.log('=== updateMCard service appelé ===');
    console.log('ID:', id);
    console.log('Original card:', originalCard);
    console.log('Has profile picture file:', !!profilePictureFile);
    
    let profilePictureUrl = originalCard.profile_picture_url;

    if (profilePictureFile) {
      console.log('Uploading new profile picture...');
      if (originalCard.profile_picture_url) {
        console.log('Deleting old profile picture...');
        try {
          await deleteProfilePicture(originalCard.profile_picture_url);
        } catch (error) {
          console.warn('Could not delete old profile picture:', error);
        }
      }
      profilePictureUrl = await uploadProfilePicture(profilePictureFile, userId);
      console.log('New profile picture uploaded:', profilePictureUrl);
    } else if (mcardData.profile_picture_url === null) {
      // L'utilisateur a explicitement supprimé sa photo
      if (originalCard.profile_picture_url) {
        try {
          await deleteProfilePicture(originalCard.profile_picture_url);
        } catch (error) {
          console.warn('Could not delete profile picture:', error);
        }
      }
      profilePictureUrl = null;
    } else if (mcardData.profile_picture_url && mcardData.profile_picture_url !== originalCard.profile_picture_url) {
      // Une nouvelle URL a été fournie (différente de l'originale)
      profilePictureUrl = mcardData.profile_picture_url;
    }
    // Sinon, on garde l'ancienne URL (pas de changement)

    console.log('Updating mCard in database...');
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

    if (error) {
      console.error('Database update error:', error);
      throw error;
    }
    
    console.log('MCard updated successfully:', data);
    // Add timestamp to profile picture URL to force refresh and avoid cache
    if (data.profile_picture_url) {
      data.profile_picture_url = `${data.profile_picture_url}?t=${Date.now()}`;
    }
    return data;
  } catch (error) {
    console.error('Error in updateMCard service:', error);
    throw error;
  }
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
