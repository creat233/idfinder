
import { AdminPermission } from "@/types/adminPermission";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminPermissionsTableRowProps {
  permission: AdminPermission;
  onRefresh: () => Promise<void>;
}

export const AdminPermissionsTableRow = ({ permission, onRefresh }: AdminPermissionsTableRowProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('admin_permissions')
        .delete()
        .eq('id', permission.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Permission administrateur supprimée avec succès.",
      });

      await onRefresh();
    } catch (error) {
      console.error('Erreur suppression permission:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer cette permission.",
      });
    }
  };

  return (
    <TableRow>
      <TableCell>{permission.user_email}</TableCell>
      <TableCell>
        <Badge variant={permission.permission_type === 'super_admin' ? 'default' : 'secondary'}>
          {permission.permission_type}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={permission.is_active ? 'default' : 'destructive'}>
          {permission.is_active ? 'Actif' : 'Inactif'}
        </Badge>
      </TableCell>
      <TableCell>{new Date(permission.created_at).toLocaleDateString('fr-FR')}</TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
