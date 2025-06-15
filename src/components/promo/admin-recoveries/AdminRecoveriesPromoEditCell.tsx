
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Save, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/integrations/supabase/client";
import { TableCell } from "@/components/ui/table";

interface AdminRecoveriesPromoEditCellProps {
  recoveryId: string;
  promoCode?: string;
  promoCodeId?: string;
  onPromoUpdated: () => void;
}

export const AdminRecoveriesPromoEditCell = ({
  recoveryId,
  promoCode,
  promoCodeId,
  onPromoUpdated,
}: AdminRecoveriesPromoEditCellProps) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(promoCode || "");
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSave = async () => {
    if (!inputValue || !inputValue.trim()) {
      showError("Code promo requis", "Merci de saisir un code promo.");
      return;
    }
    setLoading(true);
    // Vérifier que le code promo existe et est actif/valide
    const { data: promo, error } = await supabase
      .from("promo_codes")
      .select("id, code, is_active, is_paid, expires_at, user_id")
      .eq("code", inputValue.trim().toUpperCase())
      .maybeSingle();

    if (error) {
      showError("Erreur Supabase", "Erreur de requête (promo_codes).");
      setLoading(false);
      return;
    }
    if (!promo) {
      showError("Code promo introuvable.", "Vérifie l'exactitude du code.");
      setLoading(false);
      return;
    }
    if (!promo.is_active || !promo.is_paid || new Date(promo.expires_at) < new Date()) {
      showError("Ce code promo n'est pas actif, payé ou est expiré.");
      setLoading(false);
      return;
    }

    // Associer ce code promo à la carte signalée
    try {
      const { data: updateData, error: updateError } = await supabase
        .from("reported_cards")
        .update({ promo_code_id: promo.id })
        .eq("id", recoveryId)
        .select();

      if (updateError) {
        console.error("Erreur lors de l'association du code promo:", updateError);
        showError("Erreur lors de l'association", updateError.message || "Impossible d'associer le code promo.");
        setLoading(false);
        return;
      }

      if (!updateData || updateData.length === 0) {
        showError("Erreur", "Aucune récupération mise à jour, ID inexistant.");
        setLoading(false);
        return;
      }
      
      // Notifier le propriétaire du code promo de son utilisation
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
            user_id: promo.user_id,
            type: "promo_code_used",
            title: "🎉 Code promo utilisé !",
            message: `Votre code promo ${promo.code} vient d'être utilisé ! Attendez la confirmation de récupération pour recevoir votre revenu de 1000 FCFA.`,
            is_read: false
        });

      if (notificationError) {
          console.warn("La notification au propriétaire du code a échoué mais le code a été associé.", notificationError);
      }

      showSuccess(
        "Code promo associé ✔️",
        `Code ${promo.code} associé à la récupération ! Le propriétaire du code a été notifié.`
      );
      setEditing(false);
      setLoading(false);
      onPromoUpdated();
    } catch (e: any) {
      showError("Erreur inattendue", e.message || "Unknown error");
      setLoading(false);
    }
  };

  return (
    <TableCell>
      <div className="space-y-1">
        {promoCode ? (
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-green-600" />
            <span className="font-mono font-semibold text-green-700">{promoCode}</span>
            <Button
              size="sm"
              variant="ghost"
              className="px-1 py-0.5"
              onClick={() => setEditing(true)}
              tabIndex={-1}
            >
              Modifier
            </Button>
          </div>
        ) : (
          !editing && (
            <Button size="sm" onClick={() => setEditing(true)} variant="outline">
              + Ajouter code promo
            </Button>
          )
        )}
        {/* Champ d'édition */}
        {editing && (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}
            className="flex flex-col gap-1 mt-1"
          >
            <Input
              type="text"
              value={inputValue}
              placeholder="CODEPROMO..."
              onChange={e => setInputValue(e.target.value)}
              className="w-32 text-xs font-mono"
              disabled={loading}
            />
            <div className="flex gap-2 mt-1">
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-3 w-3 mr-1" />
                Enregistrer
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setEditing(false)}
                disabled={loading}
              >
                <X className="h-3 w-3 mr-1" />
                Annuler
              </Button>
            </div>
          </form>
        )}
        {/* Texte d'incitation */}
        {promoCode ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
            Propriétaire gagnera 1000 FCFA
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Aucun code promo</span>
        )}
      </div>
    </TableCell>
  );
};
