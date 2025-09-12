
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const uploadProfilePicture = async (file: File, userId: string): Promise<string | null> => {
  try {
    console.log('Starting profile picture upload for user:', userId);
    console.log('File details:', { name: file.name, size: file.size, type: file.type });
    
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = `${userId}/${fileName}`;
    
    console.log('Upload path:', filePath);

    const { error: uploadError } = await supabase.storage
        .from('mcard-profile-pictures')
        .upload(filePath, file, { upsert: true });

    if (uploadError) {
        console.error("Upload Error:", uploadError);
        throw new Error(`Failed to upload profile picture: ${uploadError.message}`);
    }

    const { data } = supabase.storage
        .from('mcard-profile-pictures')
        .getPublicUrl(filePath);

    console.log('Profile picture uploaded successfully:', data.publicUrl);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    throw error;
  }
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
