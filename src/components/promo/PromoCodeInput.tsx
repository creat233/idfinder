
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePromoCodes } from "@/hooks/usePromoCodes";
import { useToast } from "@/hooks/useToast";

interface PromoCodeInputProps {
  onPromoApplied?: (discount: number, promoCodeId: string) => void;
  onPromoRemoved?: () => void;
}

export const PromoCodeInput = ({ onPromoApplied, onPromoRemoved }: PromoCodeInputProps) => {
  const { t } = useTranslation();
  const { validatePromoCode } = usePromoCodes();
  const { showSuccess, showError } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
    id: string;
  } | null>(null);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setIsValidating(true);
    try {
      const validPromo = await validatePromoCode(promoCode.trim().toUpperCase());
      
      if (validPromo) {
        const discount = 1000;
        setAppliedPromo({
          code: validPromo.code,
          discount,
          id: validPromo.id,
        });
        onPromoApplied?.(discount, validPromo.id);
        showSuccess(t("discountApplied"), `Réduction de ${discount} FCFA appliquée`);
      } else {
        showError(t("invalidPromoCode"), "");
      }
    } catch (error) {
      showError("Erreur", "Impossible de valider le code promo");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    onPromoRemoved?.();
  };

  if (appliedPromo) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-600">
            <Check className="h-3 w-3 mr-1" />
            {appliedPromo.code}
          </Badge>
          <span className="text-sm text-green-800">
            -{appliedPromo.discount} FCFA
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemovePromo}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder={t("enterPromoCode")}
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          className="flex-1"
        />
        <Button
          onClick={handleApplyPromo}
          disabled={!promoCode.trim() || isValidating}
          variant="outline"
        >
          {isValidating ? t("loading") : t("applyDiscount")}
        </Button>
      </div>
    </div>
  );
};
