
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AdminUsersTableToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onRefresh: () => void;
  resultCount: number;
}

export const AdminUsersTableToolbar = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  resultCount,
}: AdminUsersTableToolbarProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
      <Input
        placeholder="Rechercher par nom, e-mail, téléphone..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {resultCount} utilisateur{resultCount > 1 ? 's' : ''} trouvé{resultCount > 1 ? 's' : ''}
        </div>
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>
    </div>
  );
};
