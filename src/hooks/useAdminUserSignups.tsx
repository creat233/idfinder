
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./useToast";

export interface SignupData {
  signup_date: string;
  count: number;
}

export const useAdminUserSignups = () => {
  const [data, setData] = useState<SignupData[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchSignups = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_daily_user_signups');
      if (error) throw error;
      setData(data || []);
    } catch (error: any) {
      showError("Erreur", "Impossible de charger les données d'inscription.");
      console.error("Error fetching user signups:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSignups();
  }, [fetchSignups]);

  return { data, loading, refetch: fetchSignups };
};
