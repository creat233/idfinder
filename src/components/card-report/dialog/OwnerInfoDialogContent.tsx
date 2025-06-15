
import { OwnerInfoForm } from "../OwnerInfoForm";
import { RecoveryPriceSummary } from "../RecoveryPriceSummary";
import { RecoveryNextSteps } from "../RecoveryNextSteps";
import { PriceInfo } from "@/utils/pricing";

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
  priceInfo: PriceInfo;
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
  priceInfo,
}: OwnerInfoDialogContentProps) => {
  return (
    <div className="space-y-6">
      {/* Formulaire des informations personnelles */}
      <div className="space-y-4">
        <OwnerInfoForm
          ownerName={ownerName}
          ownerPhone={ownerPhone}
          onOwnerNameChange={onOwnerNameChange}
          onOwnerPhoneChange={onOwnerPhoneChange}
          onPromoApplied={onPromoApplied}
          onPromoRemoved={onPromoRemoved}
        />
      </div>

      {/* Récapitulatif des prix */}
      <div className="space-y-4">
        <RecoveryPriceSummary
          cardData={cardData}
          baseFee={baseFee}
          discount={discount}
          finalPrice={finalPrice}
          priceInfo={priceInfo}
        />
      </div>
      
      {/* Prochaines étapes */}
      <div className="space-y-4">
        <RecoveryNextSteps finalPrice={finalPrice} priceInfo={priceInfo} />
      </div>
    </div>
  );
};
