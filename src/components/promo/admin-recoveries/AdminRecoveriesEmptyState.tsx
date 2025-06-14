
interface AdminRecoveriesEmptyStateProps {
  searchTerm: string;
}

export const AdminRecoveriesEmptyState = ({ searchTerm }: AdminRecoveriesEmptyStateProps) => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      {searchTerm 
        ? "Aucune demande de récupération ne correspond à votre recherche" 
        : "Aucune demande de récupération trouvée"
      }
    </div>
  );
};
