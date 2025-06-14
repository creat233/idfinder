import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useAdminAllRecoveries } from "@/hooks/useAdminAllRecoveries";
import { AdminRecoveriesHeader } from "./admin-recoveries/AdminRecoveriesHeader";
import { AdminRecoveriesTable } from "./admin-recoveries/AdminRecoveriesTable";
import { AdminRecoveriesEmptyState } from "./admin-recoveries/AdminRecoveriesEmptyState";
import { supabase } from "@/integrations/supabase/client";

export const AdminAllRecoveries = () => {
  const { recoveries, loading, refetch, forceRefresh } = useAdminAllRecoveries();
  const [searchTerm, setSearchTerm] = useState("");

  // --- REALTIME : Sync on INSERT / UPDATE on reported_cards
  useEffect(() => {
    const channel = supabase
      .channel("recovery_realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT and UPDATE
          schema: "public",
          table: "reported_cards"
        },
        (payload) => {
          // On toute modification, forcer le refresh
          // (on pourrait affiner sur status === "recovery_requested" ou "recovered")
          forceRefresh();
        }
      )
      .subscribe();

    // Nettoyage
    return () => {
      supabase.removeChannel(channel);
    };
  }, [forceRefresh]);

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

  // Nouvelle callback : forcer la mise à jour immédiate après confirmation paiement
  const handlePaymentConfirmed = () => {
    // Forcer la mise à jour immédiate des données
    console.log("🔄 Paiement confirmé, actualisation des données...");
    forceRefresh();
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
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            {filteredRecoveries.length} demande{filteredRecoveries.length > 1 ? 's' : ''} trouvée{filteredRecoveries.length > 1 ? 's' : ''}
          </div>
          <Button
            onClick={forceRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>
        
        {filteredRecoveries.length > 0 ? (
          <AdminRecoveriesTable
            recoveries={filteredRecoveries}
            onCallOwner={handleCallOwner}
            onCallReporter={handleCallReporter}
            onCallPromoOwner={handleCallPromoOwner}
            onPaymentConfirmed={handlePaymentConfirmed}
          />
        ) : (
          <AdminRecoveriesEmptyState searchTerm={searchTerm} />
        )}
      </CardContent>
    </Card>
  );
};
