import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./useToast";

export interface AppVisitData {
  visit_date: string;
  total_visits: number;
  unique_visitors: number;
}

export const useAdminAppVisits = (daysBack: number = 30) => {
  const [data, setData] = useState<AppVisitData[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_daily_app_visits', {
        days_back: daysBack
      });
      if (error) throw error;
      setData(data || []);
    } catch (error: any) {
      showError("Erreur", "Impossible de charger les données de visites.");
      console.error("Error fetching app visits:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysBack]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  // Calculer les totaux
  const totalVisits = data.reduce((sum, day) => sum + day.total_visits, 0);
  const totalUniqueVisitors = data.reduce((sum, day) => sum + day.unique_visitors, 0);
  const recentVisits = data.slice(0, 7).reduce((sum, day) => sum + day.total_visits, 0);
  const recentUniqueVisitors = data.slice(0, 7).reduce((sum, day) => sum + day.unique_visitors, 0);

  return { 
    data, 
    loading, 
    refetch: fetchVisits,
    totalVisits,
    totalUniqueVisitors,
    recentVisits,
    recentUniqueVisitors
  };
};
