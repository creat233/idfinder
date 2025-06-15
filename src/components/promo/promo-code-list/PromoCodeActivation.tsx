
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/TranslationProvider";
import { MessageCircle } from "lucide-react";

interface PromoCodeActivationProps {
  promoCode: string;
}

export const PromoCodeActivation = ({ promoCode }: PromoCodeActivationProps) => {
  const { t } = useTranslation();

  const openWhatsApp = (code: string) => {
    const message = encodeURIComponent(t("whatsapp_activation_message", { code }));
    window.open(`https://wa.me/221710117579?text=${message}`, '_blank');
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
      <p className="text-sm text-yellow-800 mb-2">
        <strong>{t("activation_required_title")}</strong> {t("activation_required_desc")}
      </p>
      <Button
        onClick={() => openWhatsApp(promoCode)}
        className="w-full bg-green-600 hover:bg-green-700"
        size="sm"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        {t("contactWhatsApp")}
      </Button>
    </div>
  );
};
