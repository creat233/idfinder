import { TableRow, TableCell } from "@/components/ui/table";
import { MapPin, DollarSign } from "lucide-react";
import { AllRecoveryData } from "@/types/adminRecoveries";
import { AdminRecoveryPaymentButton } from "../AdminRecoveryPaymentButton";
import { AdminRecoveriesCardCell } from "./AdminRecoveriesCardCell";
import { AdminRecoveriesOwnerCell } from "./AdminRecoveriesOwnerCell";
import { AdminRecoveriesReporterCell } from "./AdminRecoveriesReporterCell";
import { AdminRecoveriesPromoEditCell } from "./AdminRecoveriesPromoEditCell";
import { AdminRecoveriesStatusCell } from "./AdminRecoveriesStatusCell";
import { AdminRecoveriesDateCell } from "./AdminRecoveriesDateCell";

interface AdminRecoveriesRowProps {
  recovery: AllRecoveryData;
  onCallOwner: (phone: string) => void;
  onCallReporter: (phone: string) => void;
  onCallPromoOwner: (phone: string) => void;
  onPaymentConfirmed?: () => void;
}

export const AdminRecoveriesRow = ({
  recovery,
  onCallOwner,
  onCallReporter,
  onCallPromoOwner,
  onPaymentConfirmed,
}: AdminRecoveriesRowProps) => {
  // Gérer l'update du code promo et déclencher refresh parent si besoin
  const handlePromoUpdated = () => {
    if (onPaymentConfirmed) onPaymentConfirmed();
  };

  return (
    <TableRow key={recovery.id}>
      <AdminRecoveriesCardCell
        cardNumber={recovery.card_number}
        documentType={recovery.document_type}
      />
      <AdminRecoveriesOwnerCell
        ownerName={recovery.owner_name}
        ownerPhone={recovery.owner_phone}
        finalPrice={recovery.final_price}
        discountAmount={recovery.discount_amount}
        promoCode={recovery.promo_code}
        onCallOwner={onCallOwner}
      />
      <AdminRecoveriesReporterCell
        reporterName={recovery.reporter_name}
        reporterPhone={recovery.reporter_phone}
        onCallReporter={onCallReporter}
      />
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="h-3 w-3" />
          <span>{recovery.location}</span>
        </div>
      </TableCell>
      <AdminRecoveriesPromoEditCell
        recoveryId={recovery.id}
        promoCode={recovery.promo_code}
        promoCodeId={recovery.promo_code_id}
        onPromoUpdated={handlePromoUpdated}
      />
      {/* AFFICHAGE MONTANT FINAL */}
      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {/* Prix après réduction si code promo present */}
            {recovery.promo_code && recovery.discount_amount ? (
              <>
                <span className="line-through opacity-60 text-sm">{recovery.final_price} FCFA</span>
                <span className="font-semibold text-green-700 text-sm">{recovery.final_price - recovery.discount_amount} FCFA</span>
                <span className="ml-2 text-xs text-green-700 font-bold">
                  -{recovery.discount_amount} FCFA
                </span>
              </>
            ) : (
              <span className="font-semibold">{recovery.final_price} FCFA</span>
            )}
          </div>
        </div>
      </TableCell>
      <AdminRecoveriesStatusCell status={recovery.status} />
      <AdminRecoveriesDateCell createdAt={recovery.created_at} />
      <TableCell>
        {recovery.status !== "recovered" && (
          <AdminRecoveryPaymentButton
            recovery={{
              id: recovery.id,
              card_number: recovery.card_number,
              owner_name: recovery.owner_name,
              owner_phone: recovery.owner_phone,
              reporter_id: recovery.reporter_id,
              reporter_name: recovery.reporter_name,
              final_price: recovery.final_price,
              promo_usage_id: recovery.promo_usage_id,
              promo_code_owner_id: recovery.promo_code_owner_id,
              promo_code: recovery.promo_code,
            }}
            onPaymentConfirmed={onPaymentConfirmed}
          />
        )}
      </TableCell>
    </TableRow>
  );
};
