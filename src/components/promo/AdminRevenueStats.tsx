
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Gift, TrendingUp, Wallet } from "lucide-react";

interface AdminRevenueStatsProps {
  stats: {
    totalRevenue: number;
    recoveryRevenue: number;
    promoCodeSalesRevenue: number;
    recoveriesWithPromo: number;
    recoveriesWithoutPromo: number;
    paidPromoCodes: number;
  };
}

export const AdminRevenueStats = ({ stats }: AdminRevenueStatsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span>Statistiques des Revenus de FinderID</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <CardTitle className="text-sm font-medium text-blue-800">Revenu des Récupérations</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.recoveryRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recoveriesWithoutPromo} sans promo, {stats.recoveriesWithPromo} avec promo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Ventes de Codes Promo</CardTitle>
              <Gift className="h-4 w-4 text-purple-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.promoCodeSalesRevenue)}</div>
              <p className="text-xs text-muted-foreground">{stats.paidPromoCodes} codes vendus</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
