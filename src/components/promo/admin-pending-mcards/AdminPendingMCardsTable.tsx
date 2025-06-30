
import { AdminPendingMCardsItem } from "./AdminPendingMCardsItem";
import { AdminPendingMCardsEmptyState } from "./AdminPendingMCardsEmptyState";

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
  essential: { price: 15000, name: 'Essentiel' },
  premium: { price: 25000, name: 'Premium' }
};

interface AdminPendingMCardsTableProps {
  pendingMCards: PendingMCard[];
  loading: string | null;
  onApprove: (mcardId: string) => void;
  onPreview: (slug: string) => void;
}

export const AdminPendingMCardsTable = ({
  pendingMCards,
  loading,
  onApprove,
  onPreview
}: AdminPendingMCardsTableProps) => {
  if (pendingMCards.length === 0) {
    return <AdminPendingMCardsEmptyState />;
  }

  return (
    <div className="space-y-4">
      {pendingMCards.map((mcard) => {
        const planInfo = PLAN_PRICES[mcard.plan as keyof typeof PLAN_PRICES];
        return (
          <AdminPendingMCardsItem
            key={mcard.id}
            mcard={mcard}
            planInfo={planInfo}
            loading={loading}
            onApprove={onApprove}
            onPreview={onPreview}
          />
        );
      })}
    </div>
  );
};
