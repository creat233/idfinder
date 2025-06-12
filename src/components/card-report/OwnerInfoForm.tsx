
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PromoCodeInput } from "@/components/promo/PromoCodeInput";
import { supabase } from "@/integrations/supabase/client";
import { getCountryInfo } from "@/utils/countryDetection";

interface OwnerInfoFormProps {
  ownerName: string;
  ownerPhone: string;
  onOwnerNameChange: (value: string) => void;
  onOwnerPhoneChange: (value: string) => void;
  onPromoApplied: (discount: number, promoCodeId: string) => void;
  onPromoRemoved: () => void;
}

// Mapping des codes pays vers leurs indicatifs téléphoniques
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

  // Récupérer le pays et définir l'indicatif téléphonique
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
            
            // Si le numéro de téléphone est vide, pré-remplir avec l'indicatif
            if (!ownerPhone) {
              onOwnerPhoneChange(phoneCode + ' ');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user country:', error);
      }
    };

    getUserCountry();
  }, []);

  const handlePhoneChange = (value: string) => {
    // Si l'utilisateur efface tout, remettre l'indicatif du pays
    if (value.length === 0) {
      onOwnerPhoneChange(countryCode + ' ');
      return;
    }
    
    // Si l'utilisateur essaie de supprimer l'indicatif, le maintenir
    if (!value.startsWith(countryCode)) {
      // Extraire seulement les chiffres après l'indicatif
      const numbersOnly = value.replace(/[^\d]/g, '');
      onOwnerPhoneChange(countryCode + ' ' + numbersOnly);
      return;
    }
    
    onOwnerPhoneChange(value);
  };

  const countryInfo = getCountryInfo(userCountry, 'fr');

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="ownerName" className="text-sm sm:text-base font-medium">
          Nom complet *
        </Label>
        <Input
          id="ownerName"
          type="text"
          value={ownerName}
          onChange={(e) => onOwnerNameChange(e.target.value)}
          placeholder="Votre nom et prénom"
          required
          className="w-full text-sm sm:text-base p-3 sm:p-4"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ownerPhone" className="text-sm sm:text-base font-medium">
          Numéro de téléphone *
        </Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="text-base">{countryInfo.flag}</span>
              <span className="hidden sm:inline">{countryInfo.name}</span>
              <span className="sm:hidden">SN</span>
              <span className="font-medium">({countryCode})</span>
            </span>
          </div>
          <Input
            id="ownerPhone"
            type="tel"
            value={ownerPhone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder={`${countryCode} 77 123 45 67`}
            required
            className="w-full text-sm sm:text-base p-3 sm:p-4"
          />
        </div>
        <p className="text-xs text-gray-500">
          L'indicatif de votre pays ({countryCode}) est automatiquement ajouté
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm sm:text-base font-medium">
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
