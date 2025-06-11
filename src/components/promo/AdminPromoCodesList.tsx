
import { useAdminPromoData } from "@/hooks/useAdminPromoData";
import { PromoStatsCards } from "./PromoStatsCards";
import { PromoCodesTable } from "./PromoCodesTable";

export const AdminPromoCodesList = () => {
  const { promoCodes, loading, stats } = useAdminPromoData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PromoStatsCards stats={stats} />
      <PromoCodesTable promoCodes={promoCodes} />
    </div>
  );
};
