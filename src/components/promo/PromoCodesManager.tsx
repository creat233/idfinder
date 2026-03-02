
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Share2, TrendingUp, Users, Gift, Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { usePromoCodes } from "@/hooks/usePromoCodes";
import { PromoCodesList } from "./PromoCodesList";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";

export const PromoCodesManager = () => {
  const { promoCodes, loading, createPromoCode } = usePromoCodes();
  const { t } = useTranslation();

  const handleGenerateCode = async () => {
    await createPromoCode();
  };

  const activeCodes = promoCodes.filter(code => code.is_active);
  const totalEarnings = promoCodes.reduce((sum, code) => sum + code.total_earnings, 0);
  const totalUsage = promoCodes.reduce((sum, code) => sum + code.usage_count, 0);

  return (
    <div className="space-y-5 max-w-2xl mx-auto px-1">
      {/* Header */}
      <div className="text-center pt-2">
        <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
          <Gift className="h-3 w-3 mr-1" />
          100% Gratuit
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
          {t("promoCodes")}
        </h1>
        <p className="text-sm text-muted-foreground">
          Gagnez de l'argent en partageant votre code promo
        </p>
      </div>

      {/* Stats - responsive grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="border-green-200/50 bg-green-50/50">
          <CardContent className="p-3 sm:p-4 text-center">
            <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-lg sm:text-2xl font-bold text-green-600">{totalEarnings}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">FCFA gagnés</p>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200/50 bg-blue-50/50">
          <CardContent className="p-3 sm:p-4 text-center">
            <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-lg sm:text-2xl font-bold text-blue-600">{totalUsage}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Utilisations</p>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200/50 bg-purple-50/50">
          <CardContent className="p-3 sm:p-4 text-center">
            <Share2 className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-lg sm:text-2xl font-bold text-purple-600">{activeCodes.length}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Codes actifs</p>
          </CardContent>
        </Card>
      </div>

      {/* Generate code - FREE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base">
                  Générer un code promo gratuit
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Créez votre code et commencez à gagner immédiatement
                </p>
              </div>
            </div>

            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 mb-4 border border-border/50">
              <h4 className="font-medium text-xs text-foreground mb-2">Comment ça marche ?</h4>
              <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
                <li>Générez votre code promo unique <Badge variant="outline" className="text-[9px] h-4 ml-1 border-green-300 text-green-600">Gratuit</Badge></li>
                <li>Partagez-le sur vos réseaux sociaux et avec vos proches</li>
                <li>Gagnez 1000 FCFA à chaque utilisation de votre code</li>
                <li>Collectez vos revenus pendant 2 mois</li>
              </ol>
            </div>

            <Button 
              onClick={handleGenerateCode}
              disabled={loading}
              className="w-full h-11 rounded-xl font-semibold text-sm bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              {loading ? "Génération en cours..." : "Générer mon Code Gratuit"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips - collapsible on mobile */}
      <Card className="border-amber-200/50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2 mb-3">
            <Share2 className="h-4 w-4 text-amber-600" />
            Conseils pour maximiser vos gains
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Réseaux sociaux</p>
                <p className="text-muted-foreground">Partagez sur WhatsApp, Facebook, Instagram</p>
              </div>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Proches & amis</p>
                <p className="text-muted-foreground">Envoyez votre code à votre entourage</p>
              </div>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">1000 FCFA/utilisation</p>
                <p className="text-muted-foreground">Revenus illimités, sans plafond</p>
              </div>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Valide 2 mois</p>
                <p className="text-muted-foreground">Renouvelez gratuitement après expiration</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Codes list */}
      <div>
        <h2 className="font-semibold text-foreground mb-3 text-sm px-1">Mes Codes Promo</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground text-sm mt-2">{t("loading")}</p>
          </div>
        ) : (
          <PromoCodesList promoCodes={promoCodes} />
        )}
      </div>
    </div>
  );
};
