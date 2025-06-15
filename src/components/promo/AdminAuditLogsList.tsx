
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { AdminAuditLogsTable } from "./admin-audit/AdminAuditLogsTable";
import { AdminAuditLogsEmptyState } from "./admin-audit/AdminAuditLogsEmptyState";

export const AdminAuditLogsList = () => {
  const { logs, loading } = useAuditLogs();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            Journal d'Audit et de Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <ShieldCheck className="h-5 w-5" />
          Journal d'Audit et de Sécurité
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
          <AdminAuditLogsTable logs={logs} />
        ) : (
          <AdminAuditLogsEmptyState />
        )}
      </CardContent>
    </Card>
  );
};
