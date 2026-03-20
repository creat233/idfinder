import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MCard } from '@/types/mcard';

interface MCardCoverPhotoProps {
  mcard: MCard;
  isOwner: boolean;
  onUpdate?: () => void;
}

export const MCardCoverPhoto = ({ mcard, isOwner, onUpdate }: MCardCoverPhotoProps) => {
  const [uploading, setUploading] = useState(false);
  const [coverUrl, setCoverUrl] = useState(mcard.cover_image_url);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "Max 5 Mo", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `covers/${mcard.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('mcard-assets')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('mcard-assets')
        .getPublicUrl(path);

      const { error: updateError } = await supabase
        .from('mcards')
        .update({ cover_image_url: publicUrl })
        .eq('id', mcard.id);

      if (updateError) throw updateError;

      setCoverUrl(publicUrl);
      toast({ title: "Bannière mise à jour !" });
      onUpdate?.();
    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Impossible de télécharger l'image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      await supabase.from('mcards').update({ cover_image_url: null }).eq('id', mcard.id);
      setCoverUrl(null);
      toast({ title: "Bannière supprimée" });
      onUpdate?.();
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const defaultGradient = 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500';

  return (
    <div className="relative w-full h-32 sm:h-40 md:h-48 rounded-t-2xl overflow-hidden">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt="Bannière"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`w-full h-full ${defaultGradient}`} />
      )}

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      {isOwner && (
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          <label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
            <Button
              size="sm"
              variant="secondary"
              className="cursor-pointer bg-white/90 hover:bg-white text-xs h-7 px-2"
              asChild
            >
              <span>
                <Camera className="h-3 w-3 mr-1" />
                {uploading ? '...' : 'Bannière'}
              </span>
            </Button>
          </label>
          {coverUrl && (
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-xs h-7 w-7 p-0"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
