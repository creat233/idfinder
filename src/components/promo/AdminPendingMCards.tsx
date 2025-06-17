
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';

interface PendingMCard {
  id: string;
  full_name: string;
  plan: string;
  created_at: string;
  user_email: string;
  user_phone: string;
}

export const AdminPendingMCards = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [pendingMCards, setPendingMCards] = useState<PendingMCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<string | null>(null);

  const fetchPendingMCards = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('admin_get_pending_mcards');
    
    if (error) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: error.message,
      });
    } else {
      setPendingMCards(data || []);
    }
    setLoading(false);
  }, [t, toast]);

  useEffect(() => {
    fetchPendingMCards();
  }, [fetchPendingMCards]);

  const handleValidatePayment = async (mcardId: string) => {
    setValidatingId(mcardId);
    const { data, error } = await supabase.rpc('admin_approve_mcard_subscription', { p_mcard_id: mcardId });

    if (error || !data || !data[0].success) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: error ? error.message : (data && data[0] ? data[0].message : t('mCardApprovalError')),
      });
    } else {
      toast({
        title: t('mCardApprovedSuccessTitle'),
        description: t('mCardApprovedSuccessDescription'),
      });
      // Refresh the list after validation
      await fetchPendingMCards();
    }
    setValidatingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pendingMCardPaymentsTitle')}</CardTitle>
        <CardDescription>{t('pendingMCardPaymentsDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : pendingMCards.length === 0 ? (
          <p className="text-muted-foreground">{t('noPendingMCardPayments')}</p>
        ) : (
          <div className="space-y-4">
            {pendingMCards.map(card => (
              <div key={card.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">
                <div className="flex-grow">
                  <p className="font-semibold">{card.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('plan')}: <span className="font-medium capitalize text-primary">{card.plan}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {card.user_email} - {card.user_phone || 'N/A'}
                  </p>
                </div>
                <Button 
                  onClick={() => handleValidatePayment(card.id)}
                  disabled={validatingId === card.id}
                  className="w-full sm:w-auto"
                >
                  {validatingId === card.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  {t('validatePayment')}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
