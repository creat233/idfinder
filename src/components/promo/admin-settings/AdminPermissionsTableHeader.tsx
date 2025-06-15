
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const AdminPermissionsTableHeader = () => {
  return (
    <TableRow>
      <TableHead>Email</TableHead>
      <TableHead>Type de Permission</TableHead>
      <TableHead>Statut</TableHead>
      <TableHead>Créé le</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  );
};
