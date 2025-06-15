
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./useToast";
import { AuditLog } from "@/types/auditLog";

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_audit_logs');
      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      showError("Erreur", "Impossible de charger les journaux d'audit.");
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, refetch: fetchLogs };
};
