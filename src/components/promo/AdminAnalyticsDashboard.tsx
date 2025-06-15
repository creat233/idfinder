
import { useAdminUserSignups } from "@/hooks/useAdminUserSignups";
import { AdminUserSignupsChart } from "./admin-analytics/AdminUserSignupsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const AdminAnalyticsDashboard = () => {
  const { data, loading } = useAdminUserSignups();

  return (
    <Card>
       <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <BarChart3 className="h-5 w-5" />
          Analyses et Statistiques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <AdminUserSignupsChart data={data} />
        )}
      </CardContent>
    </Card>
  );
};
