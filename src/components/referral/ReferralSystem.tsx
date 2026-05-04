import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gift, Copy, Users, CheckCircle, Share2, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export const ReferralSystem = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputCode, setInputCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  const loadReferralData = async () => {
    if (!user) return;
    try {
      // Get or create referral code
      let { data: codeData } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!codeData) {
        // Generate code via DB function
        const { data: newCode } = await supabase.rpc('generate_referral_code');
        const { data: inserted } = await supabase
          .from('referral_codes')
          .insert({ user_id: user.id, code: newCode || Math.random().toString(36).substring(2, 10).toUpperCase() })
          .select()
          .single();
        codeData = inserted;
      }

      if (codeData) setReferralCode(codeData.code);

      // Get referrals
      const { data: refs } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (refs) setReferrals(refs);
    } catch (e) {
      console.error('Error loading referral data:', e);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    showSuccess('Code copié !', 'Partagez-le avec vos amis');
  };

  const shareCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rejoins Finder ID !',
          text: `Utilise mon code de parrainage ${referralCode} sur Finder ID pour protéger tes documents et créer ta carte de visite digitale !`,
          url: `https://idfinder.lovable.app?ref=${referralCode}`,
        });
      } catch { /* cancelled */ }
    } else {
      copyCode();
    }
  };

  const submitReferralCode = async () => {
    if (!inputCode.trim() || !user) return;
    setSubmitting(true);
    try {
      // Check code exists
      const { data: codeOwner } = await supabase
        .from('referral_codes')
        .select('user_id, code')
        .eq('code', inputCode.toUpperCase())
        .maybeSingle();

      if (!codeOwner) {
        showError('Code invalide', 'Ce code de parrainage n\'existe pas');
        return;
      }

      if (codeOwner.user_id === user.id) {
        showError('Erreur', 'Vous ne pouvez pas utiliser votre propre code');
        return;
      }

      // Check if already referred
      const { data: existing } = await supabase
        .from('referrals')
        .select('id')
        .eq('referred_id', user.id)
        .maybeSingle();

      if (existing) {
        showError('Déjà parrainé', 'Vous avez déjà utilisé un code de parrainage');
        return;
      }

      // Create referral
      await supabase.from('referrals').insert({
        referrer_id: codeOwner.user_id,
        referred_id: user.id,
        referral_code: inputCode.toUpperCase(),
        status: 'completed',
        completed_at: new Date().toISOString(),
      });

      // Increment uses count
      await supabase
        .from('referral_codes')
        .update({ uses_count: (await supabase.from('referral_codes').select('uses_count').eq('code', inputCode.toUpperCase()).single()).data?.uses_count + 1 || 1 })
        .eq('code', inputCode.toUpperCase());

      showSuccess('🎉 Parrainage validé !', 'Bienvenue dans la communauté Finder ID');
      setInputCode('');
    } catch (e) {
      showError('Erreur', 'Impossible de valider le code');
    } finally {
      setSubmitting(false);
    }
  };

  const completedReferrals = referrals.filter(r => r.status === 'completed');
  const totalRewards = completedReferrals.length * 500;

  if (loading) return <div className="text-center py-8 text-muted-foreground">Chargement...</div>;
  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* My referral code */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gift className="h-5 w-5 text-purple-600" />
            Mon code de parrainage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-lg px-4 py-3 text-center font-mono text-2xl font-bold tracking-widest text-purple-700 border-2 border-dashed border-purple-300">
              {referralCode}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={copyCode} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" /> Copier
            </Button>
            <Button onClick={shareCode} className="flex-1 bg-purple-600 hover:bg-purple-700">
              <Share2 className="h-4 w-4 mr-2" /> Partager
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Partagez ce code avec vos amis. Gagnez 500 points pour chaque parrainage !
          </p>
        </CardContent>
      </Card>

      {/* Enter referral code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Entrer un code de parrainage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={inputCode}
              onChange={e => setInputCode(e.target.value.toUpperCase())}
              placeholder="CODE123"
              className="font-mono text-center tracking-widest"
              maxLength={8}
            />
            <Button onClick={submitReferralCode} disabled={submitting || !inputCode.trim()}>
              {submitting ? 'Validation...' : 'Valider'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center p-4">
          <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{referrals.length}</p>
          <p className="text-xs text-muted-foreground">Filleuls</p>
        </Card>
        <Card className="text-center p-4">
          <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalRewards}</p>
          <p className="text-xs text-muted-foreground">Points gagnés</p>
        </Card>
      </div>

      {/* Referral list */}
      {referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mes parrainages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {referrals.map(ref => (
              <div key={ref.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Filleul</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={ref.status === 'completed' ? 'default' : 'secondary'}>
                    {ref.status === 'completed' ? '+500 pts' : 'En attente'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(ref.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
