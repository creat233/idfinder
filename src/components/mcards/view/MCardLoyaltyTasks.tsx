import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Star, Share2, MessageCircle, Bookmark, 
  ThumbsUp, Gift, CheckCircle2, Lock, Sparkles,
  Trophy, Target
} from 'lucide-react';
import { useLoyaltyActions } from '@/hooks/useLoyaltyActions';
import { supabase } from '@/integrations/supabase/client';

interface LoyaltyProgramSettings {
  pointsPerFavorite: number;
  pointsPerLike: number;
  pointsPerShare: number;
  pointsPerReview: number;
  pointsPerProductLike: number;
  pointsPerSave: number;
  pointsPerMessage: number;
}

interface MCardLoyaltyTasksProps {
  mcardId: string;
  onActionComplete?: (actionType: string) => void;
}

export const MCardLoyaltyTasks = ({ mcardId, onActionComplete }: MCardLoyaltyTasksProps) => {
  const { completedActions, loading, programActive, isActionCompleted, awardPoints } = useLoyaltyActions(mcardId);
  const [settings, setSettings] = useState<LoyaltyProgramSettings | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [animatingAction, setAnimatingAction] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('mcard_loyalty_programs')
        .select('*')
        .eq('mcard_id', mcardId)
        .eq('is_active', true)
        .single();

      if (data) {
        setSettings({
          pointsPerFavorite: data.points_per_favorite,
          pointsPerLike: data.points_per_like,
          pointsPerShare: data.points_per_share,
          pointsPerReview: data.points_per_review,
          pointsPerProductLike: data.points_per_product_like,
          pointsPerSave: data.points_per_save,
          pointsPerMessage: data.points_per_message
        });
      }
    };
    fetchSettings();
  }, [mcardId]);

  if (!programActive || !settings) {
    return null;
  }

  const tasks = [
    { 
      type: 'favorite', 
      label: 'Ajouter aux favoris', 
      icon: Star, 
      points: settings.pointsPerFavorite,
      color: 'from-amber-500 to-yellow-500',
      bgColor: 'bg-amber-50'
    },
    { 
      type: 'like', 
      label: 'Aimer la carte', 
      icon: Heart, 
      points: settings.pointsPerLike,
      color: 'from-pink-500 to-red-500',
      bgColor: 'bg-pink-50'
    },
    { 
      type: 'share', 
      label: 'Partager la carte', 
      icon: Share2, 
      points: settings.pointsPerShare,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    { 
      type: 'save', 
      label: 'Sauvegarder', 
      icon: Bookmark, 
      points: settings.pointsPerSave,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50'
    },
    { 
      type: 'review', 
      label: 'Laisser un avis', 
      icon: MessageCircle, 
      points: settings.pointsPerReview,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    { 
      type: 'product_like', 
      label: 'Aimer un produit', 
      icon: ThumbsUp, 
      points: settings.pointsPerProductLike,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    }
  ].filter(t => t.points > 0);

  const completedCount = tasks.filter(t => isActionCompleted(t.type)).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const totalPossiblePoints = tasks.reduce((acc, t) => acc + t.points, 0);
  const earnedPoints = completedActions.reduce((acc, a) => acc + a.pointsEarned, 0);

  const handleAction = async (actionType: string) => {
    if (!isAuthenticated) return;
    if (isActionCompleted(actionType)) return;

    setAnimatingAction(actionType);
    const result = await awardPoints(actionType);
    
    setTimeout(() => setAnimatingAction(null), 1000);

    if (result.success && onActionComplete) {
      onActionComplete(actionType);
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Gagnez des points fidélité
            </h3>
            <p className="text-sm text-muted-foreground">
              Complétez des actions pour débloquer des récompenses
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Trophy className="w-4 h-4 mr-2" />
            {earnedPoints} pts
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Progression: {completedCount}/{tasks.length} actions
            </span>
            <span className="text-sm font-bold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          {completedCount === tasks.length && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              🎉 Bravo ! Vous avez complété toutes les actions !
            </p>
          )}
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <AnimatePresence>
            {tasks.map((task, index) => {
              const completed = isActionCompleted(task.type);
              const isAnimating = animatingAction === task.type;

              return (
                <motion.div
                  key={task.type}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isAnimating ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ delay: index * 0.05, type: "spring" }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => handleAction(task.type)}
                    disabled={completed || !isAuthenticated || loading}
                    className={`
                      w-full h-auto p-4 flex flex-col items-center gap-2 rounded-xl
                      transition-all duration-300 relative overflow-hidden
                      ${completed 
                        ? 'bg-green-100 border-2 border-green-300' 
                        : `${task.bgColor} border-2 border-transparent hover:border-primary/30 hover:shadow-lg`
                      }
                    `}
                  >
                    {/* Completed overlay */}
                    {completed && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      ${completed 
                        ? 'bg-green-500' 
                        : `bg-gradient-to-r ${task.color}`
                      }
                      shadow-md
                    `}>
                      <task.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Label */}
                    <span className={`text-xs font-semibold text-center leading-tight ${completed ? 'text-green-700' : 'text-foreground'}`}>
                      {task.label}
                    </span>

                    {/* Points Badge */}
                    <Badge 
                      variant={completed ? "default" : "secondary"}
                      className={`text-xs ${completed ? 'bg-green-600' : ''}`}
                    >
                      {completed ? '✓ ' : '+'}{task.points} pts
                    </Badge>

                    {/* Not authenticated overlay */}
                    {!isAuthenticated && !completed && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-xl">
                        <Lock className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Auth prompt */}
        {!isAuthenticated && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
            <p className="text-sm text-amber-800">
              <Lock className="w-4 h-4 inline mr-1" />
              Connectez-vous pour gagner des points et débloquer des récompenses
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
