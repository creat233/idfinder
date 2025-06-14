
import { Table, TableBody } from "@/components/ui/table";
import { AllRecoveryData } from "@/types/adminRecoveries";
import { AdminRecoveriesTableHeader } from "./AdminRecoveriesTableHeader";
import { AdminRecoveriesRow } from "./AdminRecoveriesRow";

interface AdminRecoveriesTableProps {
  recoveries: AllRecoveryData[];
  onCallOwner: (phone: string) => void;
  onCallReporter: (phone: string) => void;
  onCallPromoOwner: (phone: string) => void;
  onPaymentConfirmed?: () => void;
}

export const AdminRecoveriesTable = ({ 
  recoveries, 
  onCallOwner, 
  onCallReporter, 
  onCallPromoOwner,
  onPaymentConfirmed 
}: AdminRecoveriesTableProps) => {
  return (
    <Table>
      <AdminRecoveriesTableHeader />
      <TableBody>
        {recoveries.map((recovery) => (
          <AdminRecoveriesRow
            key={recovery.id}
            recovery={recovery}
            onCallOwner={onCallOwner}
            onCallReporter={onCallReporter}
            onCallPromoOwner={onCallPromoOwner}
            onPaymentConfirmed={onPaymentConfirmed}
          />
        ))}
      </TableBody>
    </Table>
  );
};
