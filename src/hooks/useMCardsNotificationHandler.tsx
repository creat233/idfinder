
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { differenceInDays, parseISO } from 'date-fns';
import { MCard } from '@/types/mcard';

export const useMCardsNotificationHandler = (mcards: MCard[]) => {
  const [notifiedCards, setNotifiedCards] = useState<string[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    mcards.forEach(mcard => {
      if (mcard.plan === 'free' && mcard.subscription_expires_at && !notifiedCards.includes(mcard.id)) {
        const expiryDate = parseISO(mcard.subscription_expires_at);
        const daysLeft = differenceInDays(expiryDate, new Date());

        if (daysLeft < 0) {
          toast({
            variant: "destructive",
            title: t('freePlanExpiredTitle'),
            description: t('freePlanExpiredDescription').replace('{cardName}', mcard.full_name || 'Sans nom'),
            duration: 9000,
          });
          setNotifiedCards(prev => [...prev, mcard.id]);
        } else if (daysLeft <= 3) {
          toast({
            title: t('freePlanExpiryTitle'),
            description: t('freePlanExpiryDescription')
              .replace('{cardName}', mcard.full_name || 'Sans nom')
              .replace('{daysLeft}', String(daysLeft)),
            duration: 9000,
          });
          setNotifiedCards(prev => [...prev, mcard.id]);
        }
      }
    });
  }, [mcards, t, toast, notifiedCards]);

  return { notifiedCards };
};
