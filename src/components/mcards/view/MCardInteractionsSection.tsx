import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, Share2, MessageCircle, Flag } from "lucide-react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ReportButton } from "@/components/mcards/ReportButton";
import { useState, useEffect } from "react";
import { MCardMessageDialog } from "../MCardMessageDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface MCardInteractionsSectionProps {
  mcardId: string;
  mcardOwnerId: string;
  mcardOwnerName: string;
}

export const MCardInteractionsSection = ({ 
  mcardId, 
  mcardOwnerId, 
  mcardOwnerName
}: MCardInteractionsSectionProps) => {
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
      
      const { data: analyticsData } = await supabase
        .from('mcard_analytics')
        .select('likes_count, favorites_count, shares_count')
        .eq('mcard_id', mcardId)
        .single();
      
      if (analyticsData) {
        setAnalytics(analyticsData);
      }
      
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
        await supabase
          .from('mcard_interactions')
          .delete()
          .eq('mcard_id', mcardId)
          .eq('user_id', user.id)
          .eq('interaction_type', 'like');
        
        setIsLiked(false);
        setAnalytics(prev => ({ ...prev, likes_count: prev.likes_count - 1 }));
      } else {
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

  const interactionButtons = [
    {
      icon: Heart,
      label: "J'aime",
      count: analytics.likes_count,
      onClick: handleLike,
      active: isLiked,
      color: "from-pink-500 to-red-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600"
    },
    {
      icon: Star,
      label: "Favori",
      count: analytics.favorites_count,
      component: <FavoriteButton mcardId={mcardId} showText={false} className="w-full" />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      icon: Share2,
      label: "Partager",
      count: analytics.shares_count,
      onClick: handleShare,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      icon: MessageCircle,
      label: "Message",
      onClick: () => handleAuthRequired(() => setIsMessageDialogOpen(true)),
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      icon: Flag,
      label: "Signaler",
      component: <ReportButton mcardId={mcardId} className="w-full" />,
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    }
  ];

  return (
    <>
      <Card className="bg-gradient-to-br from-pink-50/50 via-white to-purple-50/50 border-pink-100 shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Interactions
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {interactionButtons.map((button, index) => (
              <motion.div
                key={button.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {button.component ? (
                  <div className={`${button.bgColor} rounded-xl p-4 h-full flex flex-col items-center justify-center gap-2 border border-gray-100 hover:shadow-md transition-all`}>
                    {button.component}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={button.onClick}
                    className={`${button.bgColor} ${button.textColor} rounded-xl p-4 h-full flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all border border-gray-100 ${
                      button.active ? `bg-gradient-to-r ${button.color} text-white` : ''
                    }`}
                  >
                    <button.icon className={`w-6 h-6 ${button.active ? 'fill-current' : ''}`} />
                    <span className="text-xs font-semibold">{button.label}</span>
                    {button.count !== undefined && button.count > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/50">
                        {button.count}
                      </span>
                    )}
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

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
