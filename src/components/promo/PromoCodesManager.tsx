
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Gift, Clock, Send } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePromoCodes } from "@/hooks/usePromoCodes";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import { PromoCodesList } from "./PromoCodesList";
import { AdminPromoActivation } from "./AdminPromoActivation";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/integrations/supabase/client";

export const PromoCodesManager = () => {
  const { t } = useTranslation();
  const { promoCodes, loading, generatePromoCode } = usePromoCodes();
  const { hasActivationPermission, loading: permissionsLoading } = useAdminPermissions();
  const [generating, setGenerating] = useState(false);
  const [sendingValidation, setSendingValidation] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const handleGenerateCode = async () => {
    setGenerating(true);
    await generatePromoCode();
    setGenerating(false);
  };

  const handleSendValidationRequest = async (codeId: string) => {
    setSendingValidation(codeId);
    try {
      // Marquer le code comme en attente de validation en mettant à jour un champ ou en créant une notification
      const { error } = await supabase
        .from("promo_codes")
        .update({ 
          // On peut ajouter un champ validation_requested si nécessaire
          // Pour l'instant, on utilise le système existant
        })
        .eq("id", codeId);

      if (error) throw error;

      showSuccess("Demande envoyée", "Votre demande de validation a été envoyée à l'administration");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande:", error);
      showError("Erreur", "Impossible d'envoyer la demande de validation");
    } finally {
      setSendingValidation(null);
    }
  };

  if (loading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{t("promoCodes")}</h1>
        <p className="text-muted-foreground">{t("promoCodeBenefits")}</p>
      </div>

      {/* Section d'administration pour les utilisateurs autorisés */}
      {hasActivationPermission && (
        <AdminPromoActivation />
      )}

      <Tabs defaultValue="my-codes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-codes">{t("myPromoCodes")}</TabsTrigger>
          <TabsTrigger value="buy-new">{t("buyPromoCode")}</TabsTrigger>
        </TabsList>

        <TabsContent value="my-codes" className="space-y-4">
          <div className="space-y-4">
            {promoCodes.map((code) => (
              <Card key={code.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-primary" />
                        <span className="font-mono font-bold text-lg">{code.code}</span>
                        <div className="flex gap-2">
                          {code.is_active ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Actif
                            </span>
                          ) : code.is_paid ? (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Payé
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              En attente
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>Créé le: {new Date(code.created_at).toLocaleDateString('fr-FR')}</div>
                        <div>Utilisations: {code.usage_count}</div>
                        <div>Gains: {code.total_earnings} FCFA</div>
                      </div>
                    </div>
                    
                    {!code.is_active && !code.is_paid && (
                      <Button
                        onClick={() => handleSendValidationRequest(code.id)}
                        disabled={sendingValidation === code.id}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        {sendingValidation === code.id ? "Envoi..." : "Demander validation"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {promoCodes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun code promo généré
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="buy-new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                {t("buyPromoCode")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-primary">1000 FCFA</div>
                <p className="text-muted-foreground">
                  {t("promoCodeBenefits")}
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <strong className="text-blue-800">Processus de validation :</strong>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">
                    Après avoir généré votre code, il apparaîtra automatiquement sur la page d'administration. 
                    Utilisez le bouton "Demander validation" pour notifier l'équipe qu'il est prêt à être activé.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">🎯 Avantages de votre code promo :</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Réduction de 1000 FCFA par utilisation</li>
                    <li>• Gains automatiques à chaque utilisation</li>
                    <li>• Suivi en temps réel de vos revenus</li>
                    <li>• Validation directe par l'administration</li>
                  </ul>
                </div>

                <Button
                  onClick={handleGenerateCode}
                  disabled={generating}
                  className="w-full"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {generating ? t("loading") : t("generateCode")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
