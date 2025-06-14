
import { TableCell } from "@/components/ui/table";
import { UserCheck, Phone, PhoneCall } from "lucide-react";

interface AdminRecoveriesReporterCellProps {
  reporterName: string;
  reporterPhone: string;
  onCallReporter: (phone: string) => void;
}

export const AdminRecoveriesReporterCell = ({ 
  reporterName, 
  reporterPhone, 
  onCallReporter 
}: AdminRecoveriesReporterCellProps) => {
  return (
    <TableCell>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-purple-600" />
          <span className="font-medium">{reporterName}</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Phone className="h-3 w-3" />
          {reporterPhone !== "Non renseigné" ? (
            <button
              onClick={() => onCallReporter(reporterPhone)}
              className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <PhoneCall className="h-3 w-3" />
              {reporterPhone}
            </button>
          ) : (
            <span className="text-muted-foreground italic">
              {reporterPhone}
            </span>
          )}
        </div>
        <div className="text-xs text-green-600 font-medium">
          Récompense: 2000 FCFA
        </div>
      </div>
    </TableCell>
  );
};
