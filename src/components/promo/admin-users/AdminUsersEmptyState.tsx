
import { Info } from "lucide-react";

interface AdminUsersEmptyStateProps {
  searchTerm: string;
}

export const AdminUsersEmptyState = ({ searchTerm }: AdminUsersEmptyStateProps) => {
  return (
    <div className="text-center py-10 px-4 border-dashed border-2 rounded-lg">
      <Info className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">
        {searchTerm ? "Aucun utilisateur trouvé" : "Aucun utilisateur à afficher"}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {searchTerm
          ? "Essayez de modifier vos termes de recherche."
          : "La liste des utilisateurs est actuellement vide."}
      </p>
    </div>
  );
};
