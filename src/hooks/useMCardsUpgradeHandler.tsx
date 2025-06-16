
import { useState, useRef } from 'react';

export const useMCardsUpgradeHandler = () => {
  const [upgradingCardId, setUpgradingCardId] = useState<string | null>(null);
  const pricingRef = useRef<HTMLElement>(null);

  const handleInitiateUpgrade = (cardId: string) => {
    setUpgradingCardId(cardId);
    pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleRequestUpgrade = async (
    mcardId: string, 
    plan: 'essential' | 'premium',
    requestPlanUpgrade: (id: string, plan: 'essential' | 'premium') => Promise<any>
  ) => {
    await requestPlanUpgrade(mcardId, plan);
    setUpgradingCardId(null);
  };

  return {
    upgradingCardId,
    pricingRef,
    handleInitiateUpgrade,
    handleRequestUpgrade,
  };
};
