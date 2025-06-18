
import { AdminPermission } from "@/types/adminPermission";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { AdminPermissionsTableHeader } from "./AdminPermissionsTableHeader";
import { AdminPermissionsTableRow } from "./AdminPermissionsTableRow";

interface AdminPermissionsTableProps {
  permissions: AdminPermission[];
  onRefresh: () => Promise<void>;
}

export const AdminPermissionsTable = ({ permissions, onRefresh }: AdminPermissionsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <AdminPermissionsTableHeader />
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <AdminPermissionsTableRow 
              key={permission.id} 
              permission={permission} 
              onRefresh={onRefresh}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
