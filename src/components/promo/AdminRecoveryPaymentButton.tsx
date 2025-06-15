
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Phone } from "lucide-react";
import { useAdminPromoPayments } from "@/hooks/useAdminPromoPayments";

interface AdminRecoveryPaymentButtonProps {
  recovery: {
    id: string;
    card_number: string;
    owner_name: string;
    owner_phone: string;
    reporter_id: string;
    reporter_name: string;
    final_price: number;
    promo_code_id?: string;
    promo_code_owner_id?: string;
    promo_code?: string;
    currency_symbol?: string;
  };
  onPaymentConfirmed?: () => void;
}

export const AdminRecoveryPaymentButton = ({ recovery, onPaymentConfirmed }: AdminRecoveryPaymentButtonProps) => {
  const { confirmRecoveryPayment, loading } = useAdminPromoPayments();

  const handleConfirmPayment = async () => {
    const success = await confirmRecoveryPayment({
      cardId: recovery.id,
      ownerName: recovery.owner_name,
      ownerPhone: recovery.owner_phone,
      reporterId: recovery.reporter_id,
      reporterName: recovery.reporter_name,
      finalPrice: recovery.final_price,
      promoCodeId: recovery.promo_code_id,
      promoCodeOwnerId: recovery.promo_code_owner_id,
      promoCode: recovery.promo_code,
    });

    // Si le paiement est confirmé avec succès, déclencher la mise à jour
    if (success && onPaymentConfirmed) {
      onPaymentConfirmed();
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleConfirmPayment}
        disabled={loading}
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {loading ? (
          <>
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Traitement...
          </>
        ) : (
          <>
            <Check className="h-3 w-3 mr-1" />
            Confirmer Paiements
          </>
        )}
      </Button>
      
      <div className="text-xs space-y-1">
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
            Propriétaire: {recovery.final_price} {recovery.currency_symbol || 'FCFA'}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
            Signaleur: 2000 FCFA
          </Badge>
        </div>
        {recovery.promo_code && (
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
              Code promo: 1000 FCFA
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};
