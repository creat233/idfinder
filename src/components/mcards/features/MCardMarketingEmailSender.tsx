import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useMarketingQuota } from '@/hooks/useMarketingQuota';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Loader2, Users, AlertCircle } from 'lucide-react';

interface MCardMarketingEmailSenderProps {
  mcardId: string;
  mcardName: string;
  mcardOwnerId: string;
}

export const MCardMarketingEmailSender = ({ mcardId, mcardName, mcardOwnerId }: MCardMarketingEmailSenderProps) => {
  const { quota, loading, refresh } = useMarketingQuota(mcardId);
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendMarketing = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir le sujet et le message."
      });
      return;
    }

    if (!quota.canSend || quota.totalRemaining <= 0) {
      toast({
        variant: "destructive",
        title: "Quota épuisé",
        description: "Vous n'avez plus de messages disponibles. Achetez un pack supplémentaire."
      });
      return;
    }

    setSending(true);
    try {
      // Get all users who favorited this mcard
      const { data: favorites, error: favError } = await supabase
        .from('mcard_favorites')
        .select('user_id')
        .eq('mcard_id', mcardId);

      if (favError) throw favError;

      if (!favorites || favorites.length === 0) {
        toast({
          variant: "destructive",
          title: "Aucun destinataire",
          description: "Personne n'a encore ajouté votre carte en favoris."
        });
        setSending(false);
        return;
      }

      const recipientIds = favorites.map(f => f.user_id);
      const maxToSend = Math.min(recipientIds.length, quota.totalRemaining);
      const toSend = recipientIds.slice(0, maxToSend);

      // Create marketing campaign
      const { error: campaignError } = await supabase
        .from('mcard_marketing_campaigns')
        .insert({
          mcard_id: mcardId,
          title: subject,
          message: message,
          campaign_type: 'promotion',
          status: 'sent',
          recipients_count: toSend.length,
          sent_at: new Date().toISOString()
        });

      if (campaignError) throw campaignError;

      // Send messages to each recipient
      const messages = toSend.map(userId => ({
        mcard_id: mcardId,
        sender_id: mcardOwnerId,
        recipient_id: userId,
        subject: subject,
        message: message,
        is_marketing: true
      }));

      const { error: msgError } = await supabase
        .from('mcard_messages')
        .insert(messages);

      if (msgError) throw msgError;

      toast({
        title: "✅ Messages envoyés !",
        description: `${toSend.length} message(s) envoyé(s) à vos abonnés.`
      });

      setSubject('');
      setMessage('');
      setIsOpen(false);
      refresh();
    } catch (error: any) {
      console.error('Error sending marketing:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer les messages. Réessayez."
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full transition-all duration-300 active:scale-95 text-xs sm:text-sm h-9 sm:h-10 border-primary/20 text-primary hover:bg-primary/5"
        >
          <Mail className="h-4 w-4 mr-2" />
          Envoyer un email marketing
          {quota.totalRemaining > 0 && (
            <Badge variant="secondary" className="ml-2 text-[10px]">
              {quota.totalRemaining} dispo
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Marketing
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Quota info */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Messages disponibles</span>
            </div>
            <Badge variant={quota.totalRemaining > 0 ? "default" : "destructive"}>
              {quota.totalRemaining}
            </Badge>
          </div>

          {quota.totalRemaining <= 0 ? (
            <div className="p-4 bg-destructive/10 rounded-lg text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-destructive font-medium">
                Quota épuisé. Achetez un pack de messages pour continuer.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  placeholder="Ex: Nouvelle offre spéciale !"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Écrivez votre message marketing ici..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {message.length}/1000
                </p>
              </div>

              <Button
                onClick={handleSendMarketing}
                disabled={sending || !subject.trim() || !message.trim()}
                className="w-full"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {sending ? 'Envoi en cours...' : 'Envoyer à tous mes abonnés'}
              </Button>
            </>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Le message sera envoyé aux personnes qui ont ajouté votre carte en favoris
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
