import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, Share2, MessageCircle, Flag, Home } from "lucide-react";
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

  const handleMenuClick = () => {
    navigate('/');
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
      icon: Home,
      label: "Accueil",
      onClick: handleMenuClick,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
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
      <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Interactions
            </h3>
            <p className="text-sm text-gray-600">Interagissez avec cette carte</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {interactionButtons.map((button, index) => (
            <motion.div
              key={button.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {button.component ? (
                <div className={`${button.bgColor} rounded-2xl p-5 h-full flex flex-col items-center justify-center gap-3 border-2 border-gray-200/50 hover:border-gray-300 hover:shadow-xl transition-all duration-300`}>
                  {button.component}
                  <span className="text-sm font-bold ${button.textColor}">{button.label}</span>
                  {button.count !== undefined && button.count > 0 && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
                      {button.count}
                    </span>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={button.onClick}
                  className={`${button.bgColor} ${button.textColor} rounded-2xl p-5 h-full w-full flex flex-col items-center justify-center gap-3 hover:shadow-xl transition-all duration-300 border-2 border-gray-200/50 hover:border-gray-300 ${
                    button.active ? `bg-gradient-to-br ${button.color} text-white shadow-lg border-transparent` : ''
                  }`}
                >
                  <button.icon className={`w-7 h-7 ${button.active ? 'fill-current' : ''}`} />
                  <span className="text-sm font-bold">{button.label}</span>
                  {button.count !== undefined && button.count > 0 && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${button.active ? 'bg-white/20' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'} shadow-md`}>
                      {button.count}
                    </span>
                  )}
                </Button>
              )}
            </motion.div>
          ))}
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
