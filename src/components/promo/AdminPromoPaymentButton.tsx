
import { Button } from "@/components/ui/button";
import { DollarSign, CheckCircle } from "lucide-react";
import { useAdminPromoPayments } from "@/hooks/useAdminPromoPayments";

interface AdminPromoPaymentButtonProps {
  promoUsageId: string;
  promoCodeOwnerId: string;
  amount: number;
  disabled?: boolean;
}

export const AdminPromoPaymentButton = ({
  promoUsageId,
  promoCodeOwnerId,
  amount,
  disabled = false
}: AdminPromoPaymentButtonProps) => {
  const { confirmPromoPayment, loading } = useAdminPromoPayments();

  const handleConfirmPayment = async () => {
    await confirmPromoPayment(promoUsageId, promoCodeOwnerId, amount);
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
          <DollarSign className="h-4 w-4 mr-1" />
          Confirmer Paiement ({amount} FCFA)
        </>
      )}
    </Button>
  );
};
