
import { AuditLog } from "@/types/auditLog";
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface AdminAuditLogsTableRowProps {
  log: AuditLog;
}

export const AdminAuditLogsTableRow = ({ log }: AdminAuditLogsTableRowProps) => {
  const formattedDate = format(new Date(log.created_at), "d MMM yyyy, HH:mm:ss", { locale: fr });

  return (
    <TableRow>
      <TableCell className="font-medium">{formattedDate}</TableCell>
      <TableCell>{log.user_email || "Système"}</TableCell>
      <TableCell>
        <Badge variant="secondary">{log.action}</Badge>
      </TableCell>
      <TableCell>
        <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-w-xs whitespace-pre-wrap">
          {log.details ? JSON.stringify(log.details, null, 2) : "N/A"}
        </pre>
      </TableCell>
      <TableCell>{log.ip_address || "N/A"}</TableCell>
    </TableRow>
  );
};
