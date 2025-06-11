
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, MessageCircle, Share2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/useToast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PromoCode {
  id: string;
  code: string;
  is_active: boolean;
  is_paid: boolean;
  created_at: string;
  expires_at: string;
  total_earnings: number;
  usage_count: number;
}

interface PromoCodesListProps {
  promoCodes: PromoCode[];
}

export const PromoCodesList = ({ promoCodes }: PromoCodesListProps) => {
  const { t } = useTranslation();
  const { showSuccess } = useToast();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    showSuccess(t("codeCopied"), "");
  };

  const openWhatsApp = (promoCode: string) => {
    const message = encodeURIComponent(`Bonjour, je souhaite activer mon code promo ${promoCode} en payant 1000 FCFA`);
    window.open(`https://wa.me/221710117579?text=${message}`, '_blank');
  };

  const shareCode = (code: string) => {
    const shareText = `Utilisez mon code promo ${code} pour avoir 1000 FCFA de réduction sur FinderID !`;
    if (navigator.share) {
      navigator.share({
        title: 'Code Promo FinderID',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      showSuccess("Texte copié", "Le texte de partage a été copié");
    }
  };

  if (promoCodes.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">{t("noPromoCodes")}</h3>
        <p className="text-muted-foreground mb-4">{t("createFirstCode")}</p>
        <p className="text-sm text-muted-foreground">{t("promoCodeBenefits")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {promoCodes.map((promoCode) => (
        <Card key={promoCode.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="font-mono text-lg">{promoCode.code}</span>
              <div className="flex gap-2">
                {promoCode.is_active ? (
                  <Badge variant="default">{t("codeActive")}</Badge>
                ) : (
                  <Badge variant="secondary">{t("codeNotActive")}</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">{t("totalEarnings")}:</span>
                <span className="ml-2">{promoCode.total_earnings} FCFA</span>
              </div>
              <div>
                <span className="font-medium">{t("usageCount")}:</span>
                <span className="ml-2">{promoCode.usage_count}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium">{t("expiresOn")}:</span>
                <span className="ml-2">
                  {format(new Date(promoCode.expires_at), "dd/MM/yyyy", { locale: fr })}
                </span>
              </div>
            </div>

            {!promoCode.is_active && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800 mb-2">{t("paymentInstructions")}</p>
                <Button
                  onClick={() => openWhatsApp(promoCode.code)}
                  className="w-full"
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t("contactWhatsApp")}
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(promoCode.code)}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                {t("copyCode")}
              </Button>
              {promoCode.is_active && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareCode(promoCode.code)}
                  className="flex-1"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {t("shareOnSocial")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
