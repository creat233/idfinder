
import { AdminPermission } from "@/types/adminPermission";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { AdminPermissionsTableHeader } from "./AdminPermissionsTableHeader";
import { AdminPermissionsTableRow } from "./AdminPermissionsTableRow";

interface AdminPermissionsTableProps {
  permissions: AdminPermission[];
}

export const AdminPermissionsTable = ({ permissions }: AdminPermissionsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <AdminPermissionsTableHeader />
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <AdminPermissionsTableRow key={permission.id} permission={permission} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
