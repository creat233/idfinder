
import { CreditCard } from "lucide-react";

export const AdminPendingMCardsEmptyState = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>Aucune mCard en attente de validation</p>
    </div>
  );
};
