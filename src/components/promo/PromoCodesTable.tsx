
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PromoCodeData } from "@/types/promo";

interface PromoCodesTableProps {
  promoCodes: PromoCodeData[];
}

export const PromoCodesTable = ({ promoCodes }: PromoCodesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCodes = promoCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Tous les codes promo
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
              <TableHead>Code</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Utilisations</TableHead>
              <TableHead>Gains</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead>Expire le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCodes.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-mono font-semibold">{code.code}</TableCell>
                <TableCell>{code.user_name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{code.user_email}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge variant={code.is_active ? "default" : "secondary"}>
                      {code.is_active ? "Actif" : "Inactif"}
                    </Badge>
                    {code.is_paid && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Payé
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{code.usage_count}</TableCell>
                <TableCell>{code.total_earnings} FCFA</TableCell>
                <TableCell>
                  {format(new Date(code.created_at), "dd/MM/yyyy", { locale: fr })}
                </TableCell>
                <TableCell>
                  {format(new Date(code.expires_at), "dd/MM/yyyy", { locale: fr })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredCodes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "Aucun code ne correspond à votre recherche" : "Aucun code promo trouvé"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
