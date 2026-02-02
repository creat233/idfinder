import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Gift, 
  Star, 
  Trophy,
  Coins,
  Percent,
  ChevronRight,
  Loader2,
  Lock
} from 'lucide-react';

interface LoyaltyReward {
  id: string;
  name: string;
  description: string | null;
  pointsRequired: number;
  rewardType: string;
  rewardValue: number;
  isActive: boolean;
}

interface LoyaltyProgram {
  id: string;
  isActive: boolean;
  pointsPerPurchase: number;
  pointsPerFavorite: number;
  pointsPerMessage: number;
  pointsPerLike: number;
  pointsPerShare: number;
  pointsPerReview: number;
  pointsPerProductLike: number;
  pointsPerSave: number;
}

interface CustomerPoints {
  totalPoints: number;
  lifetimePoints: number;
}

interface MCardVisitorLoyaltyProps {
  mcardId: string;
  mcardOwnerName?: string;
}

const rewardTypeIcons: Record<string, React.ReactNode> = {
  discount: <Percent className="h-4 w-4" />,
  gift: <Gift className="h-4 w-4" />,
  vip: <Trophy className="h-4 w-4" />,
  free_service: <Star className="h-4 w-4" />
};

const rewardTypeLabels: Record<string, string> = {
  discount: 'Réduction',
  gift: 'Cadeau',
  vip: 'VIP',
  free_service: 'Service gratuit'
};

export const MCardVisitorLoyalty = ({ mcardId, mcardOwnerName }: MCardVisitorLoyaltyProps) => {
  const { user } = useAuth();
  const [program, setProgram] = useState<LoyaltyProgram | null>(null);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [customerPoints, setCustomerPoints] = useState<CustomerPoints | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoyaltyData();
  }, [mcardId, user?.id]);

  const fetchLoyaltyData = async () => {
    try {
      // Fetch program
      const { data: programData, error: programError } = await supabase
        .from('mcard_loyalty_programs')
        .select('*')
        .eq('mcard_id', mcardId)
        .eq('is_active', true)
        .maybeSingle();

      if (programError) throw programError;

      if (programData) {
        setProgram({
          id: programData.id,
          isActive: programData.is_active,
          pointsPerPurchase: programData.points_per_purchase,
          pointsPerFavorite: programData.points_per_favorite,
          pointsPerMessage: programData.points_per_message,
          pointsPerLike: programData.points_per_like,
          pointsPerShare: programData.points_per_share,
          pointsPerReview: programData.points_per_review,
          pointsPerProductLike: programData.points_per_product_like,
          pointsPerSave: programData.points_per_save
        });

        // Fetch rewards
        const { data: rewardsData, error: rewardsError } = await supabase
          .from('mcard_loyalty_rewards')
          .select('*')
          .eq('mcard_id', mcardId)
          .eq('is_active', true)
          .order('points_required', { ascending: true });

        if (rewardsError) throw rewardsError;

        setRewards((rewardsData || []).map(r => ({
          id: r.id,
          name: r.name,
          description: r.description,
          pointsRequired: r.points_required,
          rewardType: r.reward_type,
          rewardValue: r.reward_value,
          isActive: r.is_active
        })));

        // Fetch customer points if logged in
        if (user?.id) {
          const { data: pointsData, error: pointsError } = await supabase
            .from('mcard_loyalty_points')
            .select('total_points, lifetime_points')
            .eq('mcard_id', mcardId)
            .eq('customer_id', user.id)
            .maybeSingle();

          if (!pointsError && pointsData) {
            setCustomerPoints({
              totalPoints: pointsData.total_points,
              lifetimePoints: pointsData.lifetime_points
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Don't show if no active program
  if (!program) return null;

  const currentPoints = customerPoints?.totalPoints || 0;
  const nextReward = rewards.find(r => r.pointsRequired > currentPoints);
  const availableRewards = rewards.filter(r => r.pointsRequired <= currentPoints);
  const progressToNext = nextReward 
    ? Math.min((currentPoints / nextReward.pointsRequired) * 100, 100)
    : 100;

  return (
    <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm border-amber-200 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-amber-800">
            <Gift className="h-5 w-5 text-amber-600" />
            Programme Fidélité
          </CardTitle>
          {user && (
            <Badge className="bg-amber-500 text-white border-0">
              <Coins className="h-3 w-3 mr-1" />
              {currentPoints} pts
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Points Progress */}
        {user ? (
          <>
            {nextReward && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-700">Prochaine récompense</span>
                  <span className="font-medium text-amber-800">
                    {currentPoints}/{nextReward.pointsRequired} pts
                  </span>
                </div>
                <Progress value={progressToNext} className="h-2 bg-amber-200" />
                <p className="text-xs text-amber-600 text-center">
                  Plus que {nextReward.pointsRequired - currentPoints} pts pour "{nextReward.name}"
                </p>
              </div>
            )}

            {/* Available Rewards */}
            {availableRewards.length > 0 && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-sm font-medium text-green-700 mb-2">
                  🎉 Vous avez {availableRewards.length} récompense(s) disponible(s) !
                </p>
                <div className="space-y-2">
                  {availableRewards.map((reward) => (
                    <div key={reward.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-green-800">
                        {rewardTypeIcons[reward.rewardType]}
                        {reward.name}
                      </span>
                      <Button size="sm" variant="outline" className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-100">
                        Utiliser
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-amber-100/50 rounded-lg p-3 text-center">
            <Lock className="h-5 w-5 mx-auto mb-1 text-amber-600" />
            <p className="text-sm text-amber-700">
              Connectez-vous pour voir vos points
            </p>
          </div>
        )}

        {/* All Rewards List */}
        {rewards.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Récompenses disponibles
            </h4>
            <ScrollArea className="max-h-40">
              <div className="space-y-2 pr-2">
                {rewards.map((reward) => {
                  const isUnlocked = currentPoints >= reward.pointsRequired;
                  return (
                    <div
                      key={reward.id}
                      className={`flex items-center justify-between p-2 rounded-lg border ${
                        isUnlocked 
                          ? 'bg-white border-green-200' 
                          : 'bg-white/50 border-amber-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`p-1.5 rounded-full ${
                          isUnlocked 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-amber-100 text-amber-600'
                        }`}>
                          {rewardTypeIcons[reward.rewardType]}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isUnlocked ? 'text-green-800' : 'text-amber-800'
                          }`}>
                            {reward.name}
                          </p>
                          {reward.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {reward.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`flex-shrink-0 text-xs ${
                          isUnlocked 
                            ? 'border-green-300 text-green-600' 
                            : 'border-amber-300 text-amber-600'
                        }`}
                      >
                        {reward.pointsRequired} pts
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* How to earn points - More compact grid */}
        <div className="bg-white/60 rounded-lg p-3 border border-amber-100">
          <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Points par action (une seule fois)
          </h4>
          <div className="grid grid-cols-4 gap-1 text-center text-xs">
            {program.pointsPerFavorite > 0 && (
              <div className="bg-amber-50 rounded-lg p-1.5">
                <p className="font-bold text-amber-700">{program.pointsPerFavorite}</p>
                <p className="text-amber-600 text-[10px]">⭐ Favori</p>
              </div>
            )}
            {program.pointsPerLike > 0 && (
              <div className="bg-amber-50 rounded-lg p-1.5">
                <p className="font-bold text-amber-700">{program.pointsPerLike}</p>
                <p className="text-amber-600 text-[10px]">❤️ Like</p>
              </div>
            )}
            {program.pointsPerShare > 0 && (
              <div className="bg-amber-50 rounded-lg p-1.5">
                <p className="font-bold text-amber-700">{program.pointsPerShare}</p>
                <p className="text-amber-600 text-[10px]">🔗 Partage</p>
              </div>
            )}
            {program.pointsPerSave > 0 && (
              <div className="bg-amber-50 rounded-lg p-1.5">
                <p className="font-bold text-amber-700">{program.pointsPerSave}</p>
                <p className="text-amber-600 text-[10px]">🔖 Save</p>
              </div>
            )}
            {program.pointsPerReview > 0 && (
              <div className="bg-amber-50 rounded-lg p-1.5">
                <p className="font-bold text-amber-700">{program.pointsPerReview}</p>
                <p className="text-amber-600 text-[10px]">💬 Avis</p>
              </div>
            )}
            {program.pointsPerProductLike > 0 && (
              <div className="bg-amber-50 rounded-lg p-1.5">
                <p className="font-bold text-amber-700">{program.pointsPerProductLike}</p>
                <p className="text-amber-600 text-[10px]">👍 Produit</p>
              </div>
            )}
            {program.pointsPerMessage > 0 && (
              <div className="bg-amber-50 rounded-lg p-1.5">
                <p className="font-bold text-amber-700">{program.pointsPerMessage}</p>
                <p className="text-amber-600 text-[10px]">💬 Msg</p>
              </div>
            )}
            {program.pointsPerPurchase > 0 && (
              <div className="bg-amber-50 rounded-lg p-1.5">
                <p className="font-bold text-amber-700">{program.pointsPerPurchase}</p>
                <p className="text-amber-600 text-[10px]">🛒 Achat</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
