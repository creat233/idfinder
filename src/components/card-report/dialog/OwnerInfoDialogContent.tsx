
import { OwnerInfoForm } from "../OwnerInfoForm";
import { RecoveryPriceSummary } from "../RecoveryPriceSummary";
import { RecoveryNextSteps } from "../RecoveryNextSteps";

interface OwnerInfoDialogContentProps {
  ownerName: string;
  ownerPhone: string;
  onOwnerNameChange: (value: string) => void;
  onOwnerPhoneChange: (value: string) => void;
  onPromoApplied: (discount: number, promoCodeId: string) => void;
  onPromoRemoved: () => void;
  cardData: {
    card_number: string;
    location: string;
  };
  baseFee: number;
  discount: number;
  finalPrice: number;
}

export const OwnerInfoDialogContent = ({
  ownerName,
  ownerPhone,
  onOwnerNameChange,
  onOwnerPhoneChange,
  onPromoApplied,
  onPromoRemoved,
  cardData,
  baseFee,
  discount,
  finalPrice,
}: OwnerInfoDialogContentProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <OwnerInfoForm
        ownerName={ownerName}
        ownerPhone={ownerPhone}
        onOwnerNameChange={onOwnerNameChange}
        onOwnerPhoneChange={onOwnerPhoneChange}
        onPromoApplied={onPromoApplied}
        onPromoRemoved={onPromoRemoved}
      />

      <RecoveryPriceSummary
        cardData={cardData}
        baseFee={baseFee}
        discount={discount}
        finalPrice={finalPrice}
      />
      
      <RecoveryNextSteps finalPrice={finalPrice} />
    </div>
  );
};
