
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AdminUser } from "@/types/adminUsers";
import { Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface AdminUsersTableRowProps {
  user: AdminUser;
}

export const AdminUsersTableRow = ({ user }: AdminUsersTableRowProps) => {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "N/A";

  const handleSendEmail = () => {
    if(user.email) {
      window.location.href = `mailto:${user.email}`;
    }
  }

  const handleCall = () => {
    if(user.phone) {
      window.location.href = `tel:${user.phone}`;
    }
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{fullName}</TableCell>
      <TableCell>{user.email || 'N/A'}</TableCell>
      <TableCell>{user.phone || 'N/A'}</TableCell>
      <TableCell>
        {user.country ? <Badge variant="secondary">{user.country}</Badge> : 'N/A'}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {format(new Date(user.created_at), "d MMM yyyy", { locale: fr })}
      </TableCell>
      <TableCell className="flex gap-2">
        <Button variant="outline" size="icon" onClick={handleSendEmail} disabled={!user.email} aria-label="Envoyer un e-mail">
          <Mail className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleCall} disabled={!user.phone} aria-label="Appeler">
          <Phone className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
