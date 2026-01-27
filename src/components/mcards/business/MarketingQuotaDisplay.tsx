import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMarketingQuota, MARKETING_PACKS } from '@/hooks/useMarketingQuota';
import { 
  Mail, 
  Zap, 
  ShoppingCart, 
  Users,
  Info,
  Clock
} from 'lucide-react';
import { useState } from 'react';

interface MarketingQuotaDisplayProps {
  mcardId: string;
  favoritesCount: number;
  onBuyPack?: (packSize: number, price: number) => void;
}

export const MarketingQuotaDisplay = ({ 
  mcardId, 
  favoritesCount,
  onBuyPack
}: MarketingQuotaDisplayProps) => {
  const { quota, loading } = useMarketingQuota(mcardId);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const freeUsagePercent = ((quota.freeLimit - quota.freeRemaining) / quota.freeLimit) * 100;

  const handleBuyPack = (pack: typeof MARKETING_PACKS[0]) => {
    if (onBuyPack) {
      onBuyPack(pack.size, pack.price);
    }
    setIsPurchaseDialogOpen(false);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-blue-200">
      <CardContent className="p-4 space-y-4">
        {/* Quota hebdomadaire */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Messages cette semaine</span>
            </div>
            <Badge variant="outline" className="bg-white">
              {quota.freeRemaining}/{quota.freeLimit} gratuits
            </Badge>
          </div>
          <Progress value={freeUsagePercent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Réinitialisation chaque lundi
          </p>
        </div>

        {/* Messages payants disponibles */}
        {quota.paidRemaining > 0 && (
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Messages bonus</span>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              {quota.paidRemaining} disponibles
            </Badge>
          </div>
        )}

        {/* Nombre de destinataires potentiels */}
        <div className="flex items-center justify-between p-2 bg-white rounded-lg border">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span className="text-sm">Destinataires potentiels</span>
          </div>
          <Badge variant="secondary">{favoritesCount} personnes</Badge>
        </div>

        {/* Bouton achat */}
        <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Acheter des messages supplémentaires
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Packs de Messages Marketing
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Vous avez <strong>{favoritesCount}</strong> personnes qui ont ajouté votre carte en favoris.
                  Choisissez un pack adapté à votre audience.
                </span>
              </div>

              <div className="grid gap-2">
                {MARKETING_PACKS.map((pack) => (
                  <button
                    key={pack.size}
                    onClick={() => handleBuyPack(pack)}
                    className="flex items-center justify-between p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                  >
                    <div>
                      <p className="font-semibold">{pack.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {(pack.price / pack.size).toFixed(0)} FCFA/message
                      </p>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">
                      {pack.price.toLocaleString()} FCFA
                    </Badge>
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Les messages achetés n'expirent pas et s'ajoutent à votre quota
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
