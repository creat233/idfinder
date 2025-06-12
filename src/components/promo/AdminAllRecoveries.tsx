
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Package, Phone, User, Gift, MapPin, Calendar, DollarSign, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { useAdminAllRecoveries } from "@/hooks/useAdminAllRecoveries";
import { AdminPromoPaymentButton } from "./AdminPromoPaymentButton";

export const AdminAllRecoveries = () => {
  const { recoveries, loading, refetch } = useAdminAllRecoveries();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecoveries = recoveries.filter(recovery =>
    recovery.card_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.owner_phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.reporter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.reporter_phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.promo_code?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Package className="h-5 w-5" />
          Toutes les Demandes de Récupération
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {recoveries.length} demande{recoveries.length > 1 ? 's' : ''}
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Carte</TableHead>
              <TableHead>Propriétaire</TableHead>
              <TableHead>Signaleur</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Code Promo</TableHead>
              <TableHead>Prix Final</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecoveries.map((recovery) => (
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
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{recovery.owner_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      <a 
                        href={`tel:${recovery.owner_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {recovery.owner_phone}
                      </a>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">{recovery.reporter_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      <a 
                        href={`tel:${recovery.reporter_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {recovery.reporter_phone}
                      </a>
                    </div>
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
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-green-600" />
                        <span className="font-mono font-semibold text-green-700">{recovery.promo_code}</span>
                      </div>
                      {recovery.discount_amount && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                          -{recovery.discount_amount} FCFA
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic text-sm">Aucun code promo</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-semibold">{recovery.final_price} FCFA</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(recovery.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}
                  </div>
                </TableCell>
                <TableCell>
                  {recovery.promo_code && recovery.discount_amount && (
                    <AdminPromoPaymentButton
                      promoUsageId={recovery.id}
                      promoCodeOwnerId={recovery.reporter_id}
                      amount={1000}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredRecoveries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "Aucune demande de récupération ne correspond à votre recherche" : "Aucune demande de récupération trouvée"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
