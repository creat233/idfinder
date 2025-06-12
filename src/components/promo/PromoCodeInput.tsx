
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
      console.log("Attempting to validate promo code:", promoCode.trim().toUpperCase());
      const validPromo = await validatePromoCode(promoCode.trim().toUpperCase());
      
      if (validPromo) {
        const discount = 1000;
        console.log("Valid promo code found, applying discount:", discount);
        
        setAppliedPromo({
          code: validPromo.code,
          discount,
          id: validPromo.id,
        });
        
        // Appeler le callback pour notifier le composant parent
        onPromoApplied?.(discount, validPromo.id);
        
        showSuccess(t("discountApplied"), `Réduction de ${discount} FCFA appliquée avec succès`);
        console.log("Promo code applied successfully:", validPromo.code, "Discount:", discount);
        
        // Vider le champ de saisie après application
        setPromoCode("");
      } else {
        console.log("Invalid or inactive promo code:", promoCode);
        showError(t("invalidPromoCode"), "Vérifiez que le code est correct, actif et payé");
      }
    } catch (error) {
      console.error("Error validating promo code:", error);
      showError("Erreur", "Impossible de valider le code promo");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemovePromo = () => {
    console.log("Removing promo code:", appliedPromo?.code);
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
          <span className="text-sm text-green-800 font-semibold">
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
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApplyPromo();
            }
          }}
        />
        <Button
          onClick={handleApplyPromo}
          disabled={!promoCode.trim() || isValidating}
          variant="outline"
        >
          {isValidating ? "Validation..." : t("applyDiscount")}
        </Button>
      </div>
    </div>
  );
};
