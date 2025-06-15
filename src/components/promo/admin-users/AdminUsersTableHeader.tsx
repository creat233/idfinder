
import { TableRow, TableHead } from "@/components/ui/table";

export const AdminUsersTableHeader = () => {
  return (
    <TableRow>
      <TableHead>Nom</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Téléphone</TableHead>
      <TableHead>Pays</TableHead>
      <TableHead className="hidden md:table-cell">Inscrit le</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  );
};
