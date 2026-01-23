import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Target, 
  TrendingUp, 
  Calendar,
  Edit2,
  CheckCircle,
  AlertTriangle,
  Trophy,
  Flame,
  Star
} from 'lucide-react';
import { MCard } from '@/types/mcard';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, differenceInDays, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SalesGoal {
  type: 'monthly' | 'yearly';
  target: number;
  current: number;
  progress: number;
  daysRemaining: number;
  dailyTarget: number;
}

interface MCardSalesGoalsProps {
  mcard: MCard;
  isOwner: boolean;
}

export const MCardSalesGoals = ({ mcard, isOwner }: MCardSalesGoalsProps) => {
  const [goals, setGoals] = useState<{ monthly: SalesGoal; yearly: SalesGoal }>({
    monthly: { type: 'monthly', target: 500000, current: 0, progress: 0, daysRemaining: 30, dailyTarget: 0 },
    yearly: { type: 'yearly', target: 6000000, current: 0, progress: 0, daysRemaining: 365, dailyTarget: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newMonthlyGoal, setNewMonthlyGoal] = useState('500000');
  const [newYearlyGoal, setNewYearlyGoal] = useState('6000000');

  useEffect(() => {
    if (isOwner && mcard.id) {
      loadSalesData();
    }
  }, [isOwner, mcard.id]);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      
      // Périodes
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);

      // Charger les factures validées
      const { data: invoices } = await supabase
        .from('mcard_invoices')
        .select('amount, created_at, is_validated')
        .eq('mcard_id', mcard.id)
        .eq('is_validated', true);

      // Calculer les revenus par période
      const monthlyRevenue = invoices
        ?.filter(inv => {
          const date = new Date(inv.created_at);
          return isWithinInterval(date, { start: monthStart, end: monthEnd });
        })
        ?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;

      const yearlyRevenue = invoices
        ?.filter(inv => {
          const date = new Date(inv.created_at);
          return isWithinInterval(date, { start: yearStart, end: yearEnd });
        })
        ?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;

      // Calculs
      const monthlyTarget = parseInt(newMonthlyGoal) || 500000;
      const yearlyTarget = parseInt(newYearlyGoal) || 6000000;
      
      const daysInMonth = differenceInDays(monthEnd, now) + 1;
      const daysInYear = differenceInDays(yearEnd, now) + 1;

      const monthlyDailyTarget = daysInMonth > 0 ? (monthlyTarget - monthlyRevenue) / daysInMonth : 0;
      const yearlyDailyTarget = daysInYear > 0 ? (yearlyTarget - yearlyRevenue) / daysInYear : 0;

      setGoals({
        monthly: {
          type: 'monthly',
          target: monthlyTarget,
          current: monthlyRevenue,
          progress: Math.min((monthlyRevenue / monthlyTarget) * 100, 100),
          daysRemaining: daysInMonth,
          dailyTarget: Math.max(0, monthlyDailyTarget)
        },
        yearly: {
          type: 'yearly',
          target: yearlyTarget,
          current: yearlyRevenue,
          progress: Math.min((yearlyRevenue / yearlyTarget) * 100, 100),
          daysRemaining: daysInYear,
          dailyTarget: Math.max(0, yearlyDailyTarget)
        }
      });
    } catch (error) {
      console.error('Error loading sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGoals = () => {
    setIsEditing(false);
    loadSalesData();
  };

  if (!isOwner) return null;
  if (mcard.plan === 'free') return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-600';
    if (progress >= 75) return 'text-blue-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressEmoji = (progress: number) => {
    if (progress >= 100) return '🏆';
    if (progress >= 75) return '🔥';
    if (progress >= 50) return '💪';
    if (progress >= 25) return '🚀';
    return '🎯';
  };

  const GoalCard = ({ goal, title }: { goal: SalesGoal; title: string }) => (
    <Card className="bg-white border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${goal.progress >= 100 ? 'bg-green-100' : 'bg-blue-100'}`}>
              {goal.progress >= 100 ? (
                <Trophy className="h-4 w-4 text-green-600" />
              ) : (
                <Target className="h-4 w-4 text-blue-600" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-sm">{title}</h4>
              <p className="text-xs text-muted-foreground">
                {goal.daysRemaining} jours restants
              </p>
            </div>
          </div>
          <span className="text-2xl">{getProgressEmoji(goal.progress)}</span>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className={getProgressColor(goal.progress)}>
              {formatCurrency(goal.current)}
            </span>
            <span className="text-muted-foreground">
              / {formatCurrency(goal.target)}
            </span>
          </div>
          <Progress value={goal.progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {Math.round(goal.progress)}% atteint
          </p>
        </div>

        {goal.progress < 100 && (
          <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700 flex items-center gap-1">
              <Flame className="h-3 w-3" />
              Pour atteindre l'objectif: <strong>{formatCurrency(goal.dailyTarget)}/jour</strong>
            </p>
          </div>
        )}

        {goal.progress >= 100 && (
          <div className="p-2 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Félicitations ! Objectif atteint ! 🎉
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Target className="h-4 w-4 mr-2" />
          Objectifs de vente
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Objectifs de Vente 2026
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              {/* Modifier les objectifs */}
              {isEditing ? (
                <Card className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Objectif mensuel (FCFA)</label>
                    <Input
                      type="number"
                      value={newMonthlyGoal}
                      onChange={(e) => setNewMonthlyGoal(e.target.value)}
                      placeholder="500000"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Objectif annuel (FCFA)</label>
                    <Input
                      type="number"
                      value={newYearlyGoal}
                      onChange={(e) => setNewYearlyGoal(e.target.value)}
                      placeholder="6000000"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveGoals} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Annuler
                    </Button>
                  </div>
                </Card>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="w-full"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Modifier les objectifs
                </Button>
              )}

              {/* Objectif mensuel */}
              <GoalCard 
                goal={goals.monthly} 
                title={`Objectif ${format(new Date(), 'MMMM', { locale: fr })}`} 
              />

              {/* Objectif annuel */}
              <GoalCard 
                goal={goals.yearly} 
                title="Objectif 2026" 
              />

              {/* Conseils */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Conseils pour atteindre vos objectifs
                  </h4>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li>• Publiez 3 statuts par semaine minimum</li>
                    <li>• Répondez aux messages dans l'heure</li>
                    <li>• Demandez des avis à vos clients satisfaits</li>
                    <li>• Relancez les prospects chaque semaine</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
