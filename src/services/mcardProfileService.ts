
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const uploadProfilePicture = async (file: File, userId: string): Promise<string | null> => {
  const fileName = `${uuidv4()}-${file.name}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
      .from('mcard-profile-pictures')
      .upload(filePath, file, { upsert: true });

  if (uploadError) {
      console.error("Upload Error:", uploadError);
      throw new Error('Failed to upload profile picture.');
  }

  const { data } = supabase.storage
      .from('mcard-profile-pictures')
      .getPublicUrl(filePath);

  return data.publicUrl;
};

export const deleteProfilePicture = async (url: string) => {
    try {
      const path = new URL(url).pathname.split('/mcard-profile-pictures/')[1];
      if (path) {
          await supabase.storage.from('mcard-profile-pictures').remove([path]);
      }
    } catch (error) {
      console.error("Error deleting picture, it might not exist in storage:", error);
    }
};
