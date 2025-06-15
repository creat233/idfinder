
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/hooks/useTranslation";
import { Copy, Facebook, Mail, MessageCircle, Phone, Share2, Twitter } from "lucide-react";

interface PromoCodeShareButtonsProps {
  code: string;
}

export const PromoCodeShareButtons = ({ code }: PromoCodeShareButtonsProps) => {
  const { t } = useTranslation();
  const { showSuccess } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess(t("codeCopied"), "");
  };

  const shareOnWhatsApp = () => {
    const shareText = encodeURIComponent(t("share_message_generic", { code, origin: window.location.origin }));
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
  };

  const shareOnFacebook = () => {
    const shareUrl = window.location.origin;
    const shareText = encodeURIComponent(t("share_message_facebook_quote", { code }));
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`, '_blank');
  };

  const shareOnTwitter = () => {
    const shareUrl = window.location.origin;
    const shareText = encodeURIComponent(t("share_message_twitter", { code, origin: shareUrl }));
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(t("share_message_sms", { code, origin: window.location.origin }));
    window.open(`sms:?body=${message}`, '_self');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(t("share_message_email_subject", { code }));
    const body = encodeURIComponent(t("share_message_email_body", { code, origin: window.location.origin }));
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  };
  
  const shareGeneric = () => {
    const shareText = t("share_message_generic", { code, origin: window.location.origin });
    
    if (navigator.share) {
      navigator.share({
        title: t("share_title_generic", { code }),
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText);
      showSuccess(t("share_text_copied"), t("share_text_copied_desc"));
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <p className="text-sm text-green-800 mb-3">
        <strong>{t("code_active_title")}</strong> {t("code_active_desc")}
      </p>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(code)}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            {t("copyCode")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={shareGeneric}
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            {t("share")}
          </Button>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs text-gray-600 mb-2 font-medium">{t("share_on_socials")}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnWhatsApp}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t("shareOnWhatsApp")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnFacebook}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Facebook className="h-4 w-4 mr-2" />
              {t("shareOnFacebook")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnTwitter}
              className="text-blue-400 border-blue-200 hover:bg-blue-50"
            >
              <Twitter className="h-4 w-4 mr-2" />
              {t("shareOnTwitter")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareViaEmail}
              className="text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              <Mail className="h-4 w-4 mr-2" />
              {t("shareViaEmail")}
            </Button>
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs text-gray-600 mb-2 font-medium">{t("share_directly")}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={shareViaSMS}
            className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Phone className="h-4 w-4 mr-2" />
            {t("shareViaSMS")}
          </Button>
        </div>
      </div>
    </div>
  );
};
