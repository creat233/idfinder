
import { TableCell } from "@/components/ui/table";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AdminRecoveriesDateCellProps {
  createdAt: string;
}

export const AdminRecoveriesDateCell = ({ createdAt }: AdminRecoveriesDateCellProps) => {
  return (
    <TableCell>
      <div className="flex items-center gap-1 text-sm">
        <Calendar className="h-3 w-3" />
        {format(new Date(createdAt), "dd/MM/yyyy à HH:mm", { locale: fr })}
      </div>
    </TableCell>
  );
};
