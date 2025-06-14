import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Gift, Phone, PhoneCall } from "lucide-react";

interface AdminRecoveriesPromoCellProps {
  promoCode?: string;
  discountAmount?: number;
  promoCodeOwnerPhone?: string;
  onCallPromoOwner: (phone: string) => void;
}

export const AdminRecoveriesPromoCell = ({ 
  promoCode, 
  discountAmount, 
  promoCodeOwnerPhone, 
  onCallPromoOwner 
}: AdminRecoveriesPromoCellProps) => {
  if (!promoCode) {
    return (
      <TableCell>
        <span className="text-muted-foreground italic text-sm">Aucun code promo</span>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-green-600" />
          <span className="font-mono font-semibold text-green-700">{promoCode}</span>
        </div>
        {discountAmount && (
          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
            -{discountAmount} FCFA
          </Badge>
        )}
        <div className="text-xs text-green-600 font-medium">
          Propriétaire gagne: 1000 FCFA
        </div>
        {promoCodeOwnerPhone && (
          <div className="flex items-center gap-1 text-xs">
            <Phone className="h-3 w-3" />
            {promoCodeOwnerPhone !== "Non renseigné" ? (
              <button
                onClick={() => onCallPromoOwner(promoCodeOwnerPhone)}
                className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
              >
                <PhoneCall className="h-2 w-2" />
                {promoCodeOwnerPhone}
              </button>
            ) : (
              <span className="text-muted-foreground italic">
                {promoCodeOwnerPhone}
              </span>
            )}
          </div>
        )}
      </div>
    </TableCell>
  );
};

// Fichier conservé seulement pour compat, n'est plus utilisé dans le tableau admin principal !
