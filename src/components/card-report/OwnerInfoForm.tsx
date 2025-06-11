
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PromoCodeInput } from "@/components/promo/PromoCodeInput";

interface OwnerInfoFormProps {
  ownerName: string;
  ownerPhone: string;
  onOwnerNameChange: (value: string) => void;
  onOwnerPhoneChange: (value: string) => void;
  onPromoApplied: (discount: number, promoCodeId: string) => void;
  onPromoRemoved: () => void;
}

export const OwnerInfoForm = ({
  ownerName,
  ownerPhone,
  onOwnerNameChange,
  onOwnerPhoneChange,
  onPromoApplied,
  onPromoRemoved,
}: OwnerInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ownerName">Nom complet *</Label>
        <Input
          id="ownerName"
          type="text"
          value={ownerName}
          onChange={(e) => onOwnerNameChange(e.target.value)}
          placeholder="Votre nom et prénom"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ownerPhone">Numéro de téléphone *</Label>
        <Input
          id="ownerPhone"
          type="tel"
          value={ownerPhone}
          onChange={(e) => onOwnerPhoneChange(e.target.value)}
          placeholder="Votre numéro de téléphone"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Code promo (optionnel)</Label>
        <PromoCodeInput
          onPromoApplied={onPromoApplied}
          onPromoRemoved={onPromoRemoved}
        />
      </div>
    </div>
  );
};
