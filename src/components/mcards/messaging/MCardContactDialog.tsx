import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface MCardContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mcardId: string;
  mcardOwnerName: string;
  recipientId: string;
  context?: {
    type: 'status' | 'product';
    title: string;
  };
}

export const MCardContactDialog = ({
  isOpen,
  onClose,
  mcardId,
  mcardOwnerName,
  recipientId,
  context
}: MCardContactDialogProps) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const handleSendMessage = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Connexion requise",
        description: "Vous devez être connecté pour envoyer un message.",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Message requis",
        description: "Veuillez saisir un message.",
      });
      return;
    }

    setSending(true);
    try {
      let finalSubject = subject.trim();
      let finalMessage = message.trim();

      // Ajouter le contexte si fourni
      if (context) {
        if (!finalSubject) {
          finalSubject = context.type === 'status' 
            ? `Concernant votre statut: ${context.title}`
            : `Concernant votre produit: ${context.title}`;
        }

        finalMessage = `${finalMessage}\n\n---\n${context.type === 'status' ? 'Statut' : 'Produit'} concerné: "${context.title}"`;
      }

      if (!finalSubject) {
        finalSubject = "Message depuis votre mCard";
      }

      const { error } = await supabase
        .from('mcard_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          mcard_id: mcardId,
          subject: finalSubject,
          message: finalMessage,
        });

      if (error) {
        console.error('Erreur envoi message:', error);
        throw error;
      }

      toast({
        title: "Message envoyé !",
        description: `Votre message a été envoyé à ${mcardOwnerName}.`,
      });

      // Réinitialiser le formulaire
      setSubject('');
      setMessage('');
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description: error.message || "Impossible d'envoyer le message. Veuillez réessayer.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contacter {mcardOwnerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {context && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-800">
                {context.type === 'status' ? '📢 Statut' : '🛍️ Produit'}: {context.title}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="subject">Sujet (optionnel)</Label>
            <Input
              id="subject"
              placeholder="Sujet de votre message..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="Tapez votre message ici..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={sending || !message.trim()}
              className="flex-1 gap-2"
            >
              <Send className="h-4 w-4" />
              {sending ? 'Envoi...' : 'Envoyer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};