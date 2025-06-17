
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
  if (profilePictureFile) {
    const newUrl = await uploadProfilePicture(profilePictureFile, userId);
    mcardData.profile_picture_url = newUrl;
  }

  const { data, error } = await supabase
    .from('mcards')
    .insert({ ...mcardData, user_id: userId })
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
  if (profilePictureFile) {
    if(originalCard.profile_picture_url) {
        await deleteProfilePicture(originalCard.profile_picture_url);
    }
    const newUrl = await uploadProfilePicture(profilePictureFile, userId);
    mcardData.profile_picture_url = newUrl;
  } else if (mcardData.profile_picture_url === null && originalCard.profile_picture_url) {
    await deleteProfilePicture(originalCard.profile_picture_url);
  }

  const { data, error } = await supabase
    .from('mcards')
    .update(mcardData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteMCard = async (id: string, profilePictureUrl?: string | null): Promise<void> => {
  if(profilePictureUrl) {
      await deleteProfilePicture(profilePictureUrl);
  }
  const { error } = await supabase.from('mcards').delete().eq('id', id);
  if (error) throw error;
};

export const requestPlanUpgrade = async (id: string, plan: 'essential' | 'premium'): Promise<MCard> => {
  const { data, error } = await supabase
    .from('mcards')
    .update({ plan, subscription_status: 'pending_payment' })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
