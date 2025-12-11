import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MCardMessageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
  mcardId: string;
}

export const MCardMessageDialog = ({ 
  isOpen, 
  onOpenChange, 
  recipientId,
  recipientName,
  mcardId
}: MCardMessageDialogProps) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir un message"
      });
      return;
    }

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour envoyer un message"
        });
        setSending(false);
        return;
      }

      console.log('📤 Envoi de message:', {
        sender_id: user.id,
        recipient_id: recipientId,
        mcard_id: mcardId
      });

      const { data, error } = await supabase
        .from('mcard_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          mcard_id: mcardId,
          subject: `Message concernant ${recipientName}`,
          message: message.trim(),
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de l\'envoi:', error);
        console.error('Code d\'erreur:', error.code);
        console.error('Message d\'erreur:', error.message);
        
        let errorMessage = "Impossible d'envoyer le message";
        
        if (error.code === '23503') {
          errorMessage = "Le destinataire n'existe pas ou est invalide.";
        } else if (error.message?.includes('new row violates row-level security policy')) {
          errorMessage = "La carte n'est pas disponible pour recevoir des messages. Elle doit être publiée et active.";
        }
        
        throw new Error(errorMessage);
      }

      console.log('✅ Message envoyé avec succès:', data);

      toast({
        title: "✅ Message envoyé !",
        description: `Votre message a été envoyé à ${recipientName}`
      });

      setMessage("");
      onOpenChange(false);

    } catch (error: any) {
      console.error('❌ Erreur complète:', error);
      toast({
        variant: "destructive", 
        title: "Erreur d'envoi",
        description: error.message || "Une erreur s'est produite lors de l'envoi du message"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Envoyer un message à {recipientName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Écrivez votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSendMessage} disabled={!message.trim() || sending} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              {sending ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};