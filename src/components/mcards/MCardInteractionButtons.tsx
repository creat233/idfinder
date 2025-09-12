import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Heart } from "lucide-react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { useState, useEffect } from "react";
import { MCardMessageDialog } from "./MCardMessageDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [analytics, setAnalytics] = useState({ likes_count: 0, favorites_count: 0, shares_count: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      
      // Récupérer les analytics
      const { data: analyticsData } = await supabase
        .from('mcard_analytics')
        .select('likes_count, favorites_count, shares_count')
        .eq('mcard_id', mcardId)
        .single();
      
      if (analyticsData) {
        setAnalytics(analyticsData);
      }
      
      // Vérifier si l'utilisateur a déjà liké
      if (user) {
        const { data: likeData } = await supabase
          .from('mcard_interactions')
          .select('id')
          .eq('mcard_id', mcardId)
          .eq('user_id', user.id)
          .eq('interaction_type', 'like')
          .single();
        
        setIsLiked(!!likeData);
      }
    };
    checkAuth();
  }, [mcardId]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isLiked) {
        // Retirer le like
        await supabase
          .from('mcard_interactions')
          .delete()
          .eq('mcard_id', mcardId)
          .eq('user_id', user.id)
          .eq('interaction_type', 'like');
        
        setIsLiked(false);
        setAnalytics(prev => ({ ...prev, likes_count: prev.likes_count - 1 }));
      } else {
        // Ajouter le like
        await supabase
          .from('mcard_interactions')
          .insert({
            mcard_id: mcardId,
            user_id: user.id,
            interaction_type: 'like'
          });
        
        setIsLiked(true);
        setAnalytics(prev => ({ ...prev, likes_count: prev.likes_count + 1 }));
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter l'action",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    try {
      // Incrémenter le compteur de partages
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('mcard_interactions')
          .insert({
            mcard_id: mcardId,
            user_id: user.id,
            interaction_type: 'share'
          });
        
        setAnalytics(prev => ({ ...prev, shares_count: prev.shares_count + 1 }));
      }

      if (navigator.share) {
        await navigator.share({
          title: `MCard de ${mcardOwnerName}`,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papier"
        });
      }
    } catch (error) {
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
      <div className={`flex flex-col gap-3 ${className}`}>
        {/* Bouton Like avec compteur */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`w-12 h-12 rounded-full transition-all duration-300 ${
              isLiked 
                ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg scale-110" 
                : "bg-white/20 backdrop-blur-xl text-white border-white/20 hover:bg-white/30"
            }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          {analytics.likes_count > 0 && (
            <span className="text-xs text-white/90 font-semibold mt-1 animate-fade-in">
              {analytics.likes_count}
            </span>
          )}
        </div>

        {/* Bouton Favoris avec compteur */}
        <div className="flex flex-col items-center">
          <FavoriteButton 
            mcardId={mcardId}
            size="sm"
            showText={false}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl text-white border-white/20 hover:bg-white/30"
          />
          {analytics.favorites_count > 0 && (
            <span className="text-xs text-white/90 font-semibold mt-1 animate-fade-in">
              {analytics.favorites_count}
            </span>
          )}
        </div>

        {/* Bouton Partage avec compteur */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl text-white border-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <Share2 className="w-6 h-6" />
          </Button>
          {analytics.shares_count > 0 && (
            <span className="text-xs text-white/90 font-semibold mt-1 animate-fade-in">
              {analytics.shares_count}
            </span>
          )}
        </div>

        {/* Bouton Message */}
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAuthRequired(() => setIsMessageDialogOpen(true))}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl text-white border-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>
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