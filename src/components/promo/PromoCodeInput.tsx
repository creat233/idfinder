
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
      console.log("Validation du code promo:", promoCode.trim().toUpperCase());
      const validPromo = await validatePromoCode(promoCode.trim().toUpperCase());
      
      if (validPromo) {
        const discount = 1000;
        console.log("Code promo valide, application de la réduction:", discount);
        
        setAppliedPromo({
          code: validPromo.code,
          discount,
          id: validPromo.id,
        });
        
        onPromoApplied?.(discount, validPromo.id);
        
        showSuccess("Code promo appliqué", `Réduction de ${discount} FCFA appliquée avec succès`);
        console.log("Code promo appliqué avec succès:", validPromo.code, "Réduction:", discount);
        
        setPromoCode("");
      } else {
        console.log("Code promo invalide ou inactif:", promoCode);
        showError("Code invalide", "Ce code promo n'existe pas ou n'est plus valide");
        setPromoCode("");
      }
    } catch (error) {
      console.error("Erreur lors de la validation du code promo:", error);
      showError("Erreur", "Impossible de valider le code promo. Veuillez réessayer.");
      setPromoCode("");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemovePromo = () => {
    console.log("Suppression du code promo:", appliedPromo?.code);
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
          placeholder="Entrez votre code promo"
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
          {isValidating ? "Validation..." : "Appliquer"}
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        Le code promo est optionnel. Vous pouvez continuer sans code pour payer le prix complet.
      </p>
    </div>
  );
};
