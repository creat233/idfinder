
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./useToast";
import { AdminPermission } from "@/types/adminPermission";

export const useAdminPermissionsManager = () => {
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPermissions(data || []);
    } catch (error: any) {
      showError("Erreur", "Impossible de charger les permissions administrateur.");
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return { permissions, loading, refetch: fetchPermissions };
};
