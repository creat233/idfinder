
import { PromoCodeData } from "@/types/promo";
import { PromoCodeCard } from "./promo-code-list/PromoCodeCard";
import { PromoCodeEmptyState } from "./promo-code-list/PromoCodeEmptyState";

interface PromoCodesListProps {
  promoCodes: PromoCodeData[];
}

export const PromoCodesList = ({ promoCodes }: PromoCodesListProps) => {

  if (promoCodes.length === 0) {
    return <PromoCodeEmptyState />;
  }

  return (
    <div className="space-y-4">
      {promoCodes.map((promoCode) => (
        <PromoCodeCard key={promoCode.id} promoCode={promoCode} />
      ))}
    </div>
  );
};
