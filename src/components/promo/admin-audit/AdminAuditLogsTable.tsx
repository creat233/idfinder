
import { AuditLog } from "@/types/auditLog";
import {
  Table,
  TableBody,
  TableCaption,
} from "@/components/ui/table";
import { AdminAuditLogsTableHeader } from "./AdminAuditLogsTableHeader";
import { AdminAuditLogsTableRow } from "./AdminAuditLogsTableRow";

interface AdminAuditLogsTableProps {
  logs: AuditLog[];
}

export const AdminAuditLogsTable = ({ logs }: AdminAuditLogsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Liste des 100 dernières actions enregistrées.</TableCaption>
        <AdminAuditLogsTableHeader />
        <TableBody>
          {logs.map((log) => (
            <AdminAuditLogsTableRow key={log.id} log={log} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
