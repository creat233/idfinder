
import {
  Table,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { AdminUser } from "@/types/adminUsers";
import { AdminUsersTableHeader } from "./AdminUsersTableHeader";
import { AdminUsersTableRow } from "./AdminUsersTableRow";

interface AdminUsersTableProps {
  users: AdminUser[];
}

export const AdminUsersTable = ({ users }: AdminUsersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <AdminUsersTableHeader />
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <AdminUsersTableRow key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
