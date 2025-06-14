
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";

interface AdminRecoveriesHeaderProps {
  totalRecoveries: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const AdminRecoveriesHeader = ({ 
  totalRecoveries, 
  searchTerm, 
  onSearchChange 
}: AdminRecoveriesHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        Demandes de Récupération de Cartes
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {totalRecoveries} demande{totalRecoveries > 1 ? 's' : ''}
        </Badge>
      </CardTitle>
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4" />
        <Input
          placeholder="Rechercher par carte, propriétaire, signaleur, lieu..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
    </CardHeader>
  );
};
