
import { AdminPendingMCardsItem } from "./AdminPendingMCardsItem";
import { AdminPendingMCardsEmptyState } from "./AdminPendingMCardsEmptyState";
import { MCardDeactivationButton } from "../AdminMCardsDeactivation";

interface PendingMCard {
  id: string;
  user_id: string;
  full_name: string;
  plan: string;
  created_at: string;
  user_email: string;
  user_phone: string;
  slug: string;
  subscription_status: string;
  subscription_expires_at?: string;
}

const PLAN_PRICES = {
  essential: { price: 3000, name: 'Essentiel' },
  premium: { price: 6000, name: 'Premium' },
  ultimate: { price: 9900, name: 'Ultimate' }
};

interface AdminPendingMCardsTableProps {
  pendingMCards: PendingMCard[];
  loading: string | null;
  onApprove: (mcardId: string) => void;
  onPreview: (slug: string) => void;
  onRefresh: () => void;
}

export const AdminPendingMCardsTable = ({
  pendingMCards,
  loading,
  onApprove,
  onPreview,
  onRefresh
}: AdminPendingMCardsTableProps) => {
  // Trier les cartes: non-actives en premier, puis par date de création
  const sortedMCards = [...pendingMCards].sort((a, b) => {
    // Priorité aux cartes non-actives
    const aIsActive = a.subscription_status === 'active';
    const bIsActive = b.subscription_status === 'active';
    
    if (aIsActive !== bIsActive) {
      return aIsActive ? 1 : -1; // Non-actives en premier
    }
    
    // Si même statut, trier par date (plus récent en premier)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (sortedMCards.length === 0) {
    return <AdminPendingMCardsEmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">📊 Résumé des cartes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-lg text-blue-600">{sortedMCards.length}</div>
            <div className="text-blue-700">Total cartes</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-orange-600">
              {sortedMCards.filter(c => c.subscription_status === 'pending_payment').length}
            </div>
            <div className="text-orange-700">En attente</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-green-600">
              {sortedMCards.filter(c => c.subscription_status === 'active').length}
            </div>
            <div className="text-green-700">Actives</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-gray-600">
              {sortedMCards.filter(c => c.subscription_status === 'trial').length}
            </div>
            <div className="text-gray-700">Essai</div>
          </div>
        </div>
      </div>

        {sortedMCards.map((mcard) => {
          const planInfo = PLAN_PRICES[mcard.plan as keyof typeof PLAN_PRICES];
          return (
            <div key={mcard.id} className="flex items-center gap-2">
              <div className="flex-1">
                <AdminPendingMCardsItem
                  mcard={mcard}
                  planInfo={planInfo}
                  loading={loading}
                  onApprove={onApprove}
                  onPreview={onPreview}
                />
              </div>
              <MCardDeactivationButton
                mcard={mcard}
                onDeactivationSuccess={onRefresh}
              />
            </div>
          );
        })}
    </div>
  );
};
