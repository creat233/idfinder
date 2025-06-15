
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const AdminAuditLogsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Date et Heure</TableHead>
        <TableHead>Utilisateur</TableHead>
        <TableHead>Action</TableHead>
        <TableHead>Détails</TableHead>
        <TableHead>Adresse IP</TableHead>
      </TableRow>
    </TableHeader>
  );
};
