
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, Phone, PhoneCall } from "lucide-react";

interface AdminRecoveriesOwnerCellProps {
  ownerName: string;
  ownerPhone: string;
  finalPrice: number;
  discountAmount?: number;
  promoCode?: string;
  onCallOwner: (phone: string) => void;
}

export const AdminRecoveriesOwnerCell = ({ 
  ownerName, 
  ownerPhone, 
  finalPrice,
  discountAmount,
  promoCode,
  onCallOwner 
}: AdminRecoveriesOwnerCellProps) => {
  // Calcul du prix avec réduction
  const hasDiscount = promoCode && discountAmount && discountAmount > 0;
  const priceWithDiscount = hasDiscount ? finalPrice - discountAmount : finalPrice;

  return (
    <TableCell>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-green-600" />
          <span className="font-medium">{ownerName}</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Phone className="h-3 w-3" />
          {ownerPhone !== "Non renseigné" ? (
            <button
              onClick={() => onCallOwner(ownerPhone)}
              className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <PhoneCall className="h-3 w-3" />
              {ownerPhone}
            </button>
          ) : (
            <span className="text-muted-foreground italic">
              {ownerPhone}
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-0.5">
          <div className="text-xs text-blue-600 font-medium">
            À payer:&nbsp;
            <span className={hasDiscount ? "line-through opacity-60 mr-2" : ""}>
              {finalPrice} FCFA
            </span>
            {hasDiscount && (
              <span className="font-bold text-green-700">{priceWithDiscount} FCFA</span>
            )}
          </div>
          {hasDiscount && (
            <Badge variant="outline" className="bg-green-50 text-green-800 text-[11px] mb-0">
              Réduction code promo : -{discountAmount} FCFA
            </Badge>
          )}
        </div>
      </div>
    </TableCell>
  );
};
