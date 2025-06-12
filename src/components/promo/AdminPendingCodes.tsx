
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Clock, CheckCircle, Gift, Mail, User, Phone } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { useAdminPromoData } from "@/hooks/useAdminPromoData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";

export const AdminPendingCodes = () => {
  const { promoCodes, loading, refetch } = useAdminPromoData();
  const [searchTerm, setSearchTerm] = useState("");
  const [activating, setActivating] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  // Filtrer les codes non activés et non payés (en attente de validation)
  const pendingCodes = promoCodes.filter(code => !code.is_active && !code.is_paid);

  const filteredCodes = pendingCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActivateCode = async (codeText: string) => {
    setActivating(codeText);
    try {
      console.log("Tentative d'activation du code:", codeText);
      
      const { data, error } = await supabase.rpc('admin_activate_promo_code', {
        promo_code_text: codeText
      });

      if (error) {
        console.error("Error activating promo code:", error);
        if (error.message.includes("Permission denied")) {
          showError("Accès refusé", "Vous n'avez pas l'autorisation d'activer les codes promo");
        } else if (error.message.includes("not found")) {
          showError("Code introuvable", "Ce code promo n'existe pas dans le système");
        } else {
          showError("Erreur", `Impossible d'activer le code promo: ${error.message}`);
        }
        return;
      }

      console.log("Code activé avec succès:", data);
      showSuccess("Code activé", `Le code promo ${codeText} a été activé avec succès`);
      refetch(); // Actualiser la liste
    } catch (error: any) {
      console.error("Error activating promo code:", error);
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
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          Codes Promo en Attente de Validation
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            {pendingCodes.length} en attente
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Rechercher par code, email ou nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredCodes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code Promo</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date de Création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-orange-600" />
                      <span className="font-mono font-semibold text-lg">{code.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="font-medium">{code.user_name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <a 
                          href={`mailto:${code.user_email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {code.user_email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>Voir WhatsApp</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(code.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleActivateCode(code.code)}
                        disabled={activating === code.code}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {activating === code.code ? "Activation..." : "Valider"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "Aucun code en attente ne correspond à votre recherche" : "Aucun code promo en attente de validation"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
