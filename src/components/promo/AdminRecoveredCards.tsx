
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, CheckCircle, Package, User, UserCheck, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { useAdminAllRecoveries } from "@/hooks/useAdminAllRecoveries";

export const AdminRecoveredCards = () => {
  const { recoveries, loading } = useAdminAllRecoveries();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer uniquement les cartes récupérées (status = "recovered")
  const recoveredCards = recoveries.filter(recovery => recovery.status === "recovered");

  const filteredRecoveredCards = recoveredCards.filter(recovery =>
    recovery.card_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.reporter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recovery.promo_code && recovery.promo_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <CheckCircle className="h-5 w-5 text-green-600" />
          Cartes Déjà Récupérées
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {recoveredCards.length} carte{recoveredCards.length > 1 ? 's' : ''} récupérée{recoveredCards.length > 1 ? 's' : ''}
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Rechercher par carte, propriétaire, signaleur, lieu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredRecoveredCards.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "Aucune carte récupérée ne correspond à votre recherche" : "Aucune carte récupérée pour le moment"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Carte</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Signaleur</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Code Promo</TableHead>
                <TableHead>Prix Payé</TableHead>
                <TableHead>Date de Récupération</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecoveredCards.map((recovery) => (
                <TableRow key={recovery.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="font-mono font-semibold">{recovery.card_number}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {recovery.document_type.toUpperCase()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{recovery.owner_name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{recovery.owner_phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{recovery.reporter_name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{recovery.reporter_phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>{recovery.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {recovery.promo_code ? (
                      <div className="space-y-1">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {recovery.promo_code}
                        </Badge>
                        {recovery.discount_amount && (
                          <div className="text-xs text-green-600">
                            -{recovery.discount_amount} FCFA
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">Aucun code promo</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-green-600">
                      {recovery.final_price} FCFA
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(recovery.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
