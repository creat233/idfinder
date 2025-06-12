
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const AdminPendingCodes = () => {
  const { promoCodes, loading, refetch } = useAdminPromoData();
  const [searchTerm, setSearchTerm] = useState("");
  const [activating, setActivating] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  // Utiliser useMemo pour optimiser le filtrage
  const pendingCodes = useMemo(() => {
    console.log("🔍 FILTRAGE DES CODES EN ATTENTE:");
    console.log("- Total codes:", promoCodes.length);
    
    const pending = promoCodes.filter(code => {
      const isPending = !code.is_active && !code.is_paid;
      console.log(`- Code ${code.code}: active=${code.is_active}, paid=${code.is_paid}, pending=${isPending}`);
      return isPending;
    });
    
    console.log("- Codes en attente:", pending.length);
    return pending;
  }, [promoCodes]);
  
  const filteredCodes = useMemo(() => 
    pendingCodes.filter(code =>
      code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [pendingCodes, searchTerm]
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    setLastError(null);
    console.log("🔄 Actualisation manuelle des codes...");
    try {
      await refetch();
      showSuccess("Actualisation", "Les données ont été mises à jour");
    } catch (error) {
      console.error("Erreur lors de l'actualisation:", error);
      setLastError("Erreur lors de l'actualisation des données");
    } finally {
      setRefreshing(false);
    }
  };

  const handleActivateCode = async (codeText: string) => {
    setActivating(codeText);
    setLastError(null);
    
    try {
      console.log("⚡ Activation du code:", codeText);
      
      const { data, error } = await supabase.rpc('admin_activate_promo_code', {
        promo_code_text: codeText
      });

      if (error) {
        console.error("❌ Erreur activation:", error);
        if (error.message.includes("Permission denied")) {
          showError("Accès refusé", "Vous n'avez pas l'autorisation d'activer les codes promo");
          setLastError("Permissions insuffisantes");
        } else if (error.message.includes("not found")) {
          showError("Code introuvable", "Ce code promo n'existe pas dans le système");
          setLastError("Code promo introuvable");
        } else {
          showError("Erreur", `Impossible d'activer le code promo: ${error.message}`);
          setLastError(`Erreur d'activation: ${error.message}`);
        }
        return;
      }

      console.log("✅ Code activé avec succès:", data);
      showSuccess("Code activé", `Le code promo ${codeText} a été activé avec succès`);
      
      // Attendre un peu puis actualiser
      setTimeout(() => {
        refetch();
      }, 1000);
      
    } catch (error: any) {
      console.error("💥 Erreur activation:", error);
      const errorMsg = "Une erreur inattendue s'est produite";
      showError("Erreur", errorMsg);
      setLastError(errorMsg);
    } finally {
      setActivating(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Chargement des codes promo...</span>
        </CardContent>
      </Card>
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
        
        {lastError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{lastError}</AlertDescription>
          </Alert>
        )}

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
