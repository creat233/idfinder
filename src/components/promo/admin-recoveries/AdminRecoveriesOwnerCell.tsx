
import { TableCell } from "@/components/ui/table";
import { User, Phone, PhoneCall } from "lucide-react";

interface AdminRecoveriesOwnerCellProps {
  ownerName: string;
  ownerPhone: string;
  finalPrice: number;
  onCallOwner: (phone: string) => void;
}

export const AdminRecoveriesOwnerCell = ({ 
  ownerName, 
  ownerPhone, 
  finalPrice, 
  onCallOwner 
}: AdminRecoveriesOwnerCellProps) => {
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
        <div className="text-xs text-blue-600 font-medium">
          À payer: {finalPrice} FCFA
        </div>
      </div>
    </TableCell>
  );
};
