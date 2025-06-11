
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/integrations/supabase/client";

export const AdminPromoActivation = () => {
  const [promoCode, setPromoCode] = useState("");
  const [activating, setActivating] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleActivateCode = async () => {
    if (!promoCode.trim()) {
      showError("Erreur", "Veuillez entrer un code promo");
      return;
    }

    setActivating(true);
    try {
      const { data, error } = await supabase.rpc('admin_activate_promo_code', {
        promo_code_text: promoCode.trim().toUpperCase()
      });

      if (error) {
        console.error("Error activating promo code:", error);
        if (error.message.includes("Permission denied")) {
          showError("Accès refusé", "Vous n'avez pas l'autorisation d'activer les codes promo");
        } else if (error.message.includes("not found")) {
          showError("Code introuvable", "Ce code promo n'existe pas dans le système");
        } else {
          showError("Erreur", "Impossible d'activer le code promo");
        }
        return;
      }

      showSuccess("Code activé", `Le code promo ${promoCode.toUpperCase()} a été activé avec succès`);
      setPromoCode("");
    } catch (error: any) {
      console.error("Error activating promo code:", error);
      showError("Erreur", "Une erreur inattendue s'est produite");
    } finally {
      setActivating(false);
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Shield className="h-5 w-5" />
          Administration - Activation des codes promo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-promo-code">Code promo à activer</Label>
          <Input
            id="admin-promo-code"
            placeholder="Entrez le code promo (ex: ABC123DE)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            className="font-mono"
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Action d'administration :</strong> Cette action activera immédiatement le code promo et le marquera comme payé dans le système.
          </p>
        </div>

        <Button
          onClick={handleActivateCode}
          disabled={activating || !promoCode.trim()}
          className="w-full bg-orange-600 hover:bg-orange-700"
          size="lg"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {activating ? "Activation en cours..." : "Activer le code promo"}
        </Button>
      </CardContent>
    </Card>
  );
};
