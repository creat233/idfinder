
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Gift, TrendingUp, Wallet, CreditCard, Calendar, CalendarDays, CalendarIcon } from "lucide-react";

interface AdminRevenueStatsProps {
  stats: {
    totalRevenue: number;
    recoveryRevenue: number;
    promoCodeSalesRevenue: number;
    mcardRevenue: number;
    recoveriesWithPromo: number;
    recoveriesWithoutPromo: number;
    paidPromoCodes: number;
    approvedMCards: number;
    dailyRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
  };
}

export const AdminRevenueStats = ({ stats }: AdminRevenueStatsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Statistiques des Revenus de FinderID</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Revenus par période */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Revenus du Jour</CardTitle>
                <Calendar className="h-4 w-4 text-blue-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.dailyRevenue)}</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Revenus du Mois</CardTitle>
                <CalendarDays className="h-4 w-4 text-purple-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.monthlyRevenue)}</div>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Revenus de l'Année</CardTitle>
                <CalendarIcon className="h-4 w-4 text-green-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.yearlyRevenue)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Revenus totaux par source */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Revenu Total</CardTitle>
                <Wallet className="h-4 w-4 text-green-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">mCards Vendues</CardTitle>
                <CreditCard className="h-4 w-4 text-blue-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.mcardRevenue)}</div>
                <p className="text-xs text-muted-foreground">{stats.approvedMCards} cartes approuvées</p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Récupérations</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(stats.recoveryRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.recoveriesWithoutPromo} sans promo, {stats.recoveriesWithPromo} avec promo
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Codes Promo</CardTitle>
                <Gift className="h-4 w-4 text-purple-700" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.promoCodeSalesRevenue)}</div>
                <p className="text-xs text-muted-foregor">{stats.paidPromoCodes} codes vendus</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
