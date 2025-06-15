
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "@/types/adminUsers";
import { useToast } from "./useToast";

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('admin_get_all_users');
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      showError("Erreur", "Impossible de charger la liste des utilisateurs.");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, refetch: fetchUsers };
};
