
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { CreditCard, Wallet } from "lucide-react";

interface PersonalStatsProps {
  cardCount: number;
  totalEarnings: number;
}

export const PersonalStats = ({ cardCount, totalEarnings }: PersonalStatsProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{t('personalStats')}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('cardsUnderWatch')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cardCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalEarnings')}</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings} FCFA</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
