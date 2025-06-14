
import { TableCell } from "@/components/ui/table";
import { Package } from "lucide-react";

interface AdminRecoveriesCardCellProps {
  cardNumber: string;
  documentType: string;
}

export const AdminRecoveriesCardCell = ({ cardNumber, documentType }: AdminRecoveriesCardCellProps) => {
  return (
    <TableCell>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-blue-600" />
          <span className="font-mono font-semibold">{cardNumber}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {documentType.toUpperCase()}
        </div>
      </div>
    </TableCell>
  );
};
