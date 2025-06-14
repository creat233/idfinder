
import { Button } from "@/components/ui/button";
import { DollarSign, CheckCircle } from "lucide-react";
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
    promo_usage_id?: string;
    promo_code_owner_id?: string;
    promo_code?: string;
  };
  disabled?: boolean;
}

export const AdminRecoveryPaymentButton = ({
  recovery,
  disabled = false
}: AdminRecoveryPaymentButtonProps) => {
  const { confirmRecoveryPayment, loading } = useAdminPromoPayments();

  const handleConfirmPayment = async () => {
    await confirmRecoveryPayment({
      cardId: recovery.id,
      ownerName: recovery.owner_name,
      ownerPhone: recovery.owner_phone,
      reporterId: recovery.reporter_id,
      reporterName: recovery.reporter_name,
      finalPrice: recovery.final_price,
      promoUsageId: recovery.promo_usage_id,
      promoCodeOwnerId: recovery.promo_code_owner_id,
      promoCode: recovery.promo_code,
    });
  };

  return (
    <Button
      onClick={handleConfirmPayment}
      disabled={disabled || loading}
      size="sm"
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 mr-1" />
          Confirmer Paiement
        </>
      )}
    </Button>
  );
};
