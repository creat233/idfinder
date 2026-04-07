import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MCard } from '@/types/mcard';
import { MCardCoverPhotoEditor } from './MCardCoverPhotoEditor';

interface MCardCoverPhotoProps {
  mcard: MCard;
  isOwner: boolean;
  onUpdate?: () => void;
}

export const MCardCoverPhoto = ({ mcard, isOwner, onUpdate }: MCardCoverPhotoProps) => {
  const [coverUrl, setCoverUrl] = useState(mcard.cover_image_url);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const defaultGradient = 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500';

  const handleCoverUpdated = (newUrl: string | null) => {
    setCoverUrl(newUrl);
    onUpdate?.();
  };

  return (
    <>
      <div className="relative w-full h-32 sm:h-40 md:h-48 rounded-t-2xl overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt="Couverture"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${defaultGradient}`} />
        )}

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {isOwner && (
          <div className="absolute bottom-2 right-2 flex gap-1.5">
            <Button
              size="sm"
              variant="secondary"
              className="cursor-pointer bg-white/90 hover:bg-white text-xs h-7 px-2"
              onClick={() => setIsEditorOpen(true)}
            >
              <Camera className="h-3 w-3 mr-1" />
              Couverture
            </Button>
            {coverUrl && (
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white text-xs h-7 w-7 p-0"
                onClick={() => handleCoverUpdated(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Editor Dialog */}
      <MCardCoverPhotoEditor
        isOpen={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        mcardId={mcard.id}
        currentCoverUrl={coverUrl}
        onCoverUpdated={handleCoverUpdated}
      />
    </>
  );
};
