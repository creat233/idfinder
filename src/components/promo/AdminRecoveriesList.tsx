
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RotateCcw, Phone, Mail, Gift } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { useAdminRecoveryData } from "@/hooks/useAdminRecoveryData";

export const AdminRecoveriesList = () => {
  const { recoveries, loading } = useAdminRecoveryData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecoveries = recoveries.filter(recovery =>
    recovery.promo_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.used_by_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.promo_owner_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recovery.promo_owner_name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <RotateCcw className="h-5 w-5" />
          Récupérations Confirmées avec Codes Promo
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code Promo</TableHead>
              <TableHead>Client (Récupération)</TableHead>
              <TableHead>Propriétaire du Code</TableHead>
              <TableHead>Contact Propriétaire</TableHead>
              <TableHead>Réduction</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecoveries.map((recovery) => (
              <TableRow key={recovery.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-orange-600" />
                    <span className="font-mono font-semibold">{recovery.promo_code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {recovery.used_by_email && (
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {recovery.used_by_email}
                      </div>
                    )}
                    {recovery.used_by_phone && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {recovery.used_by_phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{recovery.promo_owner_name}</div>
                    <div className="text-sm text-muted-foreground">{recovery.promo_owner_email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      <a 
                        href={`mailto:${recovery.promo_owner_email}`}
                        className="text-blue-600 hover:underline"
                      >
                        Email
                      </a>
                    </div>
                    {recovery.promo_owner_phone && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        <a 
                          href={`tel:${recovery.promo_owner_phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {recovery.promo_owner_phone}
                        </a>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {recovery.discount_amount} FCFA
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(recovery.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredRecoveries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "Aucune récupération ne correspond à votre recherche" : "Aucune récupération avec code promo trouvée"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
