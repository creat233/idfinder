
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PromoCodeInput } from "@/components/promo/PromoCodeInput";
import { supabase } from "@/integrations/supabase/client";
import { getCountryInfo } from "@/utils/countryUtils";

interface OwnerInfoFormProps {
  ownerName: string;
  ownerPhone: string;
  onOwnerNameChange: (value: string) => void;
  onOwnerPhoneChange: (value: string) => void;
  onPromoApplied: (discount: number, promoCodeId: string) => void;
  onPromoRemoved: () => void;
}

const countryPhoneCodes: Record<string, string> = {
  'SN': '+221',
  'CI': '+225',
  'ML': '+223',
  'BF': '+226',
  'NE': '+227',
  'GN': '+224',
  'MR': '+222',
  'GM': '+220',
  'GW': '+245',
  'CV': '+238',
  'LR': '+231',
  'SL': '+232',
  'GH': '+233',
  'TG': '+228',
  'BJ': '+229',
  'NG': '+234',
  'MA': '+212',
  'DZ': '+213',
  'TN': '+216',
  'LY': '+218',
  'EG': '+20',
  'FR': '+33',
  'ES': '+34',
  'IT': '+39',
  'DE': '+49',
  'BE': '+32',
  'CH': '+41',
  'PT': '+351',
  'NL': '+31',
  'CA': '+1',
  'US': '+1',
  'GB': '+44'
};

export const OwnerInfoForm = ({
  ownerName,
  ownerPhone,
  onOwnerNameChange,
  onOwnerPhoneChange,
  onPromoApplied,
  onPromoRemoved,
}: OwnerInfoFormProps) => {
  const [userCountry, setUserCountry] = useState<string>('SN');
  const [countryCode, setCountryCode] = useState<string>('+221');

  useEffect(() => {
    const getUserCountry = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('country')
            .eq('id', user.id)
            .single();
          
          if (profile?.country) {
            setUserCountry(profile.country);
            const phoneCode = countryPhoneCodes[profile.country] || '+221';
            setCountryCode(phoneCode);
            
            if (!ownerPhone || ownerPhone === '+221 ') {
              onOwnerPhoneChange(phoneCode + ' ');
            }
          }
        }
      } catch (error) {
        console.error('Erreur récupération pays utilisateur:', error);
      }
    };

    getUserCountry();
  }, []);

  const handlePhoneChange = (value: string) => {
    if (value.length === 0) {
      onOwnerPhoneChange(countryCode + ' ');
      return;
    }
    
    if (!value.startsWith(countryCode)) {
      const numbersOnly = value.replace(/[^\d]/g, '');
      onOwnerPhoneChange(countryCode + ' ' + numbersOnly);
      return;
    }
    
    onOwnerPhoneChange(value);
  };

  const countryInfo = getCountryInfo(userCountry, 'fr');

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ownerName" className="text-sm font-medium text-gray-700">
          Nom complet *
        </Label>
        <Input
          id="ownerName"
          type="text"
          value={ownerName}
          onChange={(e) => onOwnerNameChange(e.target.value)}
          placeholder="Votre nom et prénom"
          required
          className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ownerPhone" className="text-sm font-medium text-gray-700">
          Numéro de téléphone *
        </Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600 px-1">
            <span className="flex items-center gap-1">
              <span className="text-base">{countryInfo.flag}</span>
              <span className="font-medium">{countryInfo.name} ({countryCode})</span>
            </span>
          </div>
          <Input
            id="ownerPhone"
            type="tel"
            value={ownerPhone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder={`${countryCode} 77 123 45 67`}
            required
            className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <p className="text-xs text-gray-500 px-1">
          L'indicatif de votre pays ({countryCode}) est automatiquement ajouté
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Code promo (optionnel)
        </Label>
        <PromoCodeInput
          onPromoApplied={onPromoApplied}
          onPromoRemoved={onPromoRemoved}
        />
      </div>
    </div>
  );
};
