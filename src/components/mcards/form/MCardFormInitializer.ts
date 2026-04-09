
import { useEffect } from 'react';
import { UseFormReset } from 'react-hook-form';
import { MCard } from "@/types/mcard";
import { MCardFormData } from "./mcardFormSchema";

export const useMCardFormInitializer = (
  isOpen: boolean,
  mcard: MCard | null | undefined,
  reset: UseFormReset<MCardFormData>,
  setPreview: (preview: string | null) => void,
  setProfilePictureFile: (file: File | null) => void,
  setCoverPreview: (preview: string | null) => void,
  setCoverPictureFile: (file: File | null) => void
) => {
  useEffect(() => {
    if (isOpen) {
      const defaultValues = {
        full_name: mcard?.full_name || "",
        job_title: mcard?.job_title || "",
        company: mcard?.company || "",
        description: mcard?.description || "",
        phone_number: mcard?.phone_number || "",
        email: mcard?.email || "",
        website_url: mcard?.website_url || "",
        linkedin_url: mcard?.linkedin_url || "",
        twitter_url: mcard?.twitter_url || "",
        facebook_url: mcard?.facebook_url || "",
        instagram_url: mcard?.instagram_url || "",
        youtube_url: mcard?.youtube_url || "",
        tiktok_url: mcard?.tiktok_url || "",
        snapchat_url: mcard?.snapchat_url || "",
        is_published: mcard?.is_published || false,
      };
      reset(defaultValues);
      // Forcer le refresh de la preview avec l'URL de la photo existante
      const profileUrl = mcard?.profile_picture_url;
      const coverUrl = mcard?.cover_image_url;
      console.log('Setting preview with profile URL:', profileUrl);
      setPreview(profileUrl || null);
      setProfilePictureFile(null);
      setCoverPreview(coverUrl || null);
      setCoverPictureFile(null);
    }
  }, [isOpen, mcard, reset, setPreview, setProfilePictureFile, setCoverPreview, setCoverPictureFile]);
};
