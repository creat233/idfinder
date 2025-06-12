
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, MessageCircle, Share2, Facebook, Twitter, Phone, Mail } from "lucide-react";
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

  const shareOnWhatsApp = (code: string) => {
    const shareText = encodeURIComponent(`🎉 Économisez 1000 FCFA sur FinderID avec mon code promo : ${code}\n\n💳 FinderID vous aide à retrouver vos documents perdus rapidement !\n\n🔗 Utilisez ce code lors de votre récupération pour bénéficier de la réduction.\n\nRejoignez-nous : ${window.location.origin}`);
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
  };

  const shareOnFacebook = (code: string) => {
    const shareUrl = window.location.origin;
    const shareText = encodeURIComponent(`Économisez 1000 FCFA sur FinderID avec mon code promo : ${code}. FinderID vous aide à retrouver vos documents perdus rapidement !`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`, '_blank');
  };

  const shareOnTwitter = (code: string) => {
    const shareUrl = window.location.origin;
    const shareText = encodeURIComponent(`🎉 Économisez 1000 FCFA sur @FinderID avec mon code promo : ${code}\n\n💳 Retrouvez vos documents perdus rapidement !\n\n${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
  };

  const shareViaSMS = (code: string) => {
    const message = encodeURIComponent(`🎉 Économisez 1000 FCFA sur FinderID avec mon code promo : ${code}\n\nFindRID vous aide à retrouver vos documents perdus rapidement !\n\nRejoignez-nous : ${window.location.origin}`);
    window.open(`sms:?body=${message}`, '_self');
  };

  const shareViaEmail = (code: string) => {
    const subject = encodeURIComponent(`Code promo FinderID : ${code} - Économisez 1000 FCFA`);
    const body = encodeURIComponent(`Bonjour,\n\nJe partage avec vous mon code promo FinderID : ${code}\n\nCe code vous permet d'économiser 1000 FCFA sur les frais de récupération de vos documents perdus.\n\nFindRID est une plateforme révolutionnaire qui vous aide à retrouver vos pièces d'identité perdues rapidement et en toute sécurité.\n\nPour utiliser ce code :\n1. Rendez-vous sur ${window.location.origin}\n2. Recherchez votre document perdu\n3. Utilisez le code ${code} lors du processus de récupération\n\nBonne chance !\n\nCordialement`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  };

  const shareGeneric = (code: string) => {
    const shareText = `🎉 Économisez 1000 FCFA sur FinderID avec mon code promo : ${code}\n\n💳 FinderID vous aide à retrouver vos documents perdus rapidement !\n\n🔗 Rejoignez-nous : ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Code Promo FinderID - ${code}`,
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText);
      showSuccess("Texte copié", "Le texte de partage a été copié dans le presse-papiers");
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
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {t("codeActive")}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {t("codeNotActive")}
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">{t("totalEarnings")}:</span>
                <span className="ml-2 text-green-600 font-semibold">{promoCode.total_earnings} FCFA</span>
              </div>
              <div>
                <span className="font-medium">{t("usageCount")}:</span>
                <span className="ml-2 font-semibold">{promoCode.usage_count}</span>
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
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>💰 Activation requise :</strong> Contactez le service client pour activer votre code et commencer à gagner de l'argent !
                </p>
                <Button
                  onClick={() => openWhatsApp(promoCode.code)}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t("contactWhatsApp")}
                </Button>
              </div>
            )}

            {promoCode.is_active && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 mb-3">
                  <strong>🎉 Code actif !</strong> Partagez votre code pour commencer à gagner 1000 FCFA à chaque utilisation pendant 2 mois !
                </p>
                
                {/* Options de partage */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(promoCode.code)}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copier le code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareGeneric(promoCode.code)}
                      className="flex-1"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </Button>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-600 mb-2 font-medium">📱 Partager sur les réseaux sociaux :</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareOnWhatsApp(promoCode.code)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareOnFacebook(promoCode.code)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareOnTwitter(promoCode.code)}
                        className="text-blue-400 border-blue-200 hover:bg-blue-50"
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareViaEmail(promoCode.code)}
                        className="text-gray-600 border-gray-200 hover:bg-gray-50"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-600 mb-2 font-medium">📞 Partager directement :</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareViaSMS(promoCode.code)}
                      className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Partager par SMS
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {promoCode.is_active && promoCode.usage_count > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>💰 Revenus générés :</strong> {promoCode.total_earnings} FCFA
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Continuez à partager votre code pour augmenter vos revenus !
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
