
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AdminRecoveriesStatusCellProps {
  status: string;
}

export const AdminRecoveriesStatusCell = ({ status }: AdminRecoveriesStatusCellProps) => {
  return (
    <TableCell>
      <Badge 
        variant={status === "recovered" ? "default" : "outline"}
        className={status === "recovered" ? "bg-green-100 text-green-800" : "bg-yellow-50 text-yellow-700"}
      >
        {status === "recovered" ? "Récupérée" : "En attente"}
      </Badge>
    </TableCell>
  );
};
