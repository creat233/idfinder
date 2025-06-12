
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Gift, Mail, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PromoCodeData } from "@/types/promo";

interface PendingCodesTableProps {
  codes: PromoCodeData[];
  activating: string | null;
  onActivateCode: (code: string) => void;
}

export const PendingCodesTable = ({ codes, activating, onActivateCode }: PendingCodesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code Promo</TableHead>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Date de Création</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {codes.map((code) => (
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
              </div>
            </TableCell>
            <TableCell>
              {format(new Date(code.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  En attente
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Généré automatiquement
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  onClick={() => onActivateCode(code.code)}
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
  );
};
