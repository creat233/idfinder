
import { AdminPermission } from "@/types/adminPermission";
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AdminPermissionsTableRowProps {
  permission: AdminPermission;
}

export const AdminPermissionsTableRow = ({ permission }: AdminPermissionsTableRowProps) => {
  const formattedDate = format(new Date(permission.created_at), "d MMM yyyy", { locale: fr });

  return (
    <TableRow>
      <TableCell className="font-medium">{permission.user_email}</TableCell>
      <TableCell>
        <Badge variant="secondary">{permission.permission_type}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={permission.is_active ? "default" : "destructive"}>
          {permission.is_active ? "Actif" : "Inactif"}
        </Badge>
      </TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
            <DropdownMenuItem>Désactiver</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
