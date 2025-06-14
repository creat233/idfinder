
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const AdminRecoveriesTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Carte</TableHead>
        <TableHead>Propriétaire</TableHead>
        <TableHead>Signaleur</TableHead>
        <TableHead>Lieu</TableHead>
        <TableHead>Code Promo</TableHead>
        <TableHead>Prix Final</TableHead>
        <TableHead>Statut</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
