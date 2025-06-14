
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useAdminAllRecoveries } from "@/hooks/useAdminAllRecoveries";
import { AdminRecoveriesHeader } from "./admin-recoveries/AdminRecoveriesHeader";
import { AdminRecoveriesTable } from "./admin-recoveries/AdminRecoveriesTable";
import { AdminRecoveriesEmptyState } from "./admin-recoveries/AdminRecoveriesEmptyState";

export const AdminAllRecoveries = () => {
  const { recoveries, loading, refetch } = useAdminAllRecoveries();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecoveries = recoveries.filter(recovery =>
    recovery.card_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.owner_phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.reporter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.promo_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCallOwner = (phone: string) => {
    if (phone && phone !== "Non renseigné") {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleCallReporter = (phone: string) => {
    if (phone && phone !== "Non renseigné") {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleCallPromoOwner = (phone: string) => {
    if (phone && phone !== "Non renseigné") {
      window.location.href = `tel:${phone}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <AdminRecoveriesHeader
        totalRecoveries={recoveries.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <CardContent>
        {filteredRecoveries.length > 0 ? (
          <AdminRecoveriesTable
            recoveries={filteredRecoveries}
            onCallOwner={handleCallOwner}
            onCallReporter={handleCallReporter}
            onCallPromoOwner={handleCallPromoOwner}
          />
        ) : (
          <AdminRecoveriesEmptyState searchTerm={searchTerm} />
        )}
      </CardContent>
    </Card>
  );
};
