import { Button } from "@/components/ui/button";
import { Heart, Star, Share2, MessageCircle } from "lucide-react";
import { useMCardInteractions } from "@/hooks/useMCardInteractions";
import { useState, useEffect } from "react";
import { MCardMessageDialog } from "./MCardMessageDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface MCardInteractionButtonsProps {
  mcardId: string;
  mcardOwnerId: string;
  mcardOwnerName: string;
  className?: string;
}

export const MCardInteractionButtons = ({ 
  mcardId, 
  mcardOwnerId, 
  mcardOwnerName,
  className = "" 
}: MCardInteractionButtonsProps) => {
  const {
    isLiked,
    isFavorited,
    likesCount,
    favoritesCount,
    handleLike,
    handleFavorite
  } = useMCardInteractions(mcardId);

  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MCard de ${mcardOwnerName}`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleAuthRequired = (action: () => void) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    action();
  };

  return (
    <>
      <div className={`flex gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAuthRequired(handleLike)}
          className={`flex items-center gap-1 ${isLiked ? 'text-red-600 border-red-200 bg-red-50' : ''}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          {likesCount}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAuthRequired(handleFavorite)}
          className={`flex items-center gap-1 ${isFavorited ? 'text-yellow-600 border-yellow-200 bg-yellow-50' : ''}`}
        >
          <Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          {favoritesCount}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-1"
        >
          <Share2 className="w-4 h-4" />
          Partager
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAuthRequired(() => setIsMessageDialogOpen(true))}
          className="flex items-center gap-1"
        >
          <MessageCircle className="w-4 h-4" />
          Message
        </Button>
      </div>

      <MCardMessageDialog
        isOpen={isMessageDialogOpen}
        onOpenChange={setIsMessageDialogOpen}
        recipientId={mcardOwnerId}
        recipientName={mcardOwnerName}
        mcardId={mcardId}
      />
    </>
  );
};