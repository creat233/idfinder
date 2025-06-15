
import { useAdminRevenueStats } from '@/hooks/useAdminRevenueStats';
import { AdminRevenueStats } from './AdminRevenueStats';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const AdminRevenueDashboard = () => {
  const { stats, loading } = useAdminRevenueStats();

  if (loading) {
    return (
      <Card>
        <CardHeader>
           <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
           <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return <AdminRevenueStats stats={stats} />;
};
