
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { useAdminPromoData } from "@/hooks/useAdminPromoData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { PendingCodesHeader } from "./admin-pending/PendingCodesHeader";
import { PendingCodesSearch } from "./admin-pending/PendingCodesSearch";
import { PendingCodesDebugInfo } from "./admin-pending/PendingCodesDebugInfo";
import { PendingCodesTable } from "./admin-pending/PendingCodesTable";
import { PendingCodesEmptyState } from "./admin-pending/PendingCodesEmptyState";

export const AdminPendingCodes = () => {
  const { promoCodes, loading, refetch } = useAdminPromoData();
  const [searchTerm, setSearchTerm] = useState("");
  const [activating, setActivating] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, showError } = useToast();

  // Utiliser useMemo pour optimiser le filtrage
  const pendingCodes = useMemo(() => 
    promoCodes.filter(code => !code.is_active && !code.is_paid),
    [promoCodes]
  );
  
  const filteredCodes = useMemo(() => 
    pendingCodes.filter(code =>
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [pendingCodes, searchTerm]
  );

  console.log("🔍 FILTRAGE ADMIN PENDING:", {
    totalCodes: promoCodes.length,
    pendingCodes: pendingCodes.length,
    activeNotPaid: promoCodes.filter(c => c.is_active && !c.is_paid).length,
    notActiveButPaid: promoCodes.filter(c => !c.is_active && c.is_paid).length,
    details: promoCodes.map(c => `${c.code}: active=${c.is_active}, paid=${c.is_paid}`)
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    console.log("🔄 Actualisation manuelle des codes...");
    await refetch();
    setRefreshing(false);
  };

  const handleActivateCode = async (codeText: string) => {
    setActivating(codeText);
    try {
      console.log("⚡ Activation du code:", codeText);
      
      const { data, error } = await supabase.rpc('admin_activate_promo_code', {
        promo_code_text: codeText
      });

      if (error) {
        console.error("❌ Erreur activation:", error);
        if (error.message.includes("Permission denied")) {
          showError("Accès refusé", "Vous n'avez pas l'autorisation d'activer les codes promo");
        } else if (error.message.includes("not found")) {
          showError("Code introuvable", "Ce code promo n'existe pas dans le système");
        } else {
          showError("Erreur", `Impossible d'activer le code promo: ${error.message}`);
        }
        return;
      }

      console.log("✅ Code activé avec succès:", data);
      showSuccess("Code activé", `Le code promo ${codeText} a été activé avec succès`);
      refetch();
    } catch (error: any) {
      console.error("💥 Erreur activation:", error);
      showError("Erreur", "Une erreur inattendue s'est produite");
    } finally {
      setActivating(null);
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
      <CardHeader>
        <PendingCodesHeader 
          pendingCount={pendingCodes.length}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
        <PendingCodesSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <PendingCodesDebugInfo 
          promoCodes={promoCodes}
          pendingCodes={pendingCodes}
        />
      </CardHeader>
      <CardContent>
        {filteredCodes.length > 0 ? (
          <PendingCodesTable 
            codes={filteredCodes}
            activating={activating}
            onActivateCode={handleActivateCode}
          />
        ) : (
          <PendingCodesEmptyState 
            searchTerm={searchTerm}
            pendingCodes={pendingCodes}
            promoCodes={promoCodes}
            onRefresh={handleRefresh}
          />
        )}
      </CardContent>
    </Card>
  );
};
