import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const COVER_BUCKET = 'mcard-assets';
const COVER_PREFIX = 'covers';

const sanitizeFileName = (fileName: string) => {
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  return baseName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase() || 'cover';
};

export const uploadCoverPhoto = async (file: File, mcardId: string): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${uuidv4()}-${sanitizeFileName(file.name)}.${extension}`;
  const filePath = `${COVER_PREFIX}/${mcardId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(filePath, file, { upsert: false });

  if (uploadError) {
    throw new Error(`Failed to upload cover photo: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from(COVER_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const deleteCoverPhoto = async (url: string) => {
  try {
    const [, rawPath = ''] = new URL(url).pathname.split(`/${COVER_BUCKET}/`);
    const filePath = decodeURIComponent(rawPath);

    if (!filePath) {
      return;
    }

    await supabase.storage.from(COVER_BUCKET).remove([filePath]);
  } catch (error) {
    console.error('Error deleting cover photo, it might not exist in storage:', error);
  }
};