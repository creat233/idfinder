
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/integrations/supabase/client";
import { EmailTemplateSelector } from "./EmailTemplateSelector";

export const AdminSingleEmailSender = () => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSendEmail = async () => {
    if (!recipientEmail.trim() || !subject.trim() || !message.trim()) {
      showError("Champs requis", "Veuillez remplir l'e-mail du destinataire, le sujet et le message.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
        showError("E-mail invalide", "Veuillez entrer une adresse e-mail valide.");
        return;
    }

    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-single-email', {
        body: { recipientEmail, subject, htmlContent: message },
      });

      if (error) {
        throw new Error(error.message);
      }

      showSuccess("E-mail envoyé", `L'e-mail a été envoyé à ${recipientEmail}.`);
      setRecipientEmail("");
      setSubject("");
      setMessage("");
    } catch (error: any) {
      console.error("Error sending single email:", error);
      showError("Erreur d'envoi", error.message || "Une erreur s'est produite lors de l'envoi de l'e-mail.");
    } finally {
      setSending(false);
    }
  };

  const useTemplate = (template: { subject: string, message: string }) => {
    setSubject(template.subject);
    setMessage(template.message);
    showSuccess("Modèle chargé", "Le contenu de l'e-mail a été pré-rempli.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-primary">
            <Mail className="h-5 w-5" />
            Envoyer un e-mail à un utilisateur spécifique
          </div>
          <EmailTemplateSelector useTemplate={useTemplate} context="single" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient-email">E-mail du destinataire</Label>
          <Input
            id="recipient-email"
            type="email"
            placeholder="Ex: utilisateur@exemple.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="single-email-subject">Sujet de l'e-mail</Label>
          <Input
            id="single-email-subject"
            placeholder="Sujet de votre message"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="single-email-message">Message (HTML supporté)</Label>
          <Textarea
            id="single-email-message"
            placeholder="Écrivez votre message ici..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
          />
        </div>
        <Button
          onClick={handleSendEmail}
          disabled={sending || !recipientEmail.trim() || !subject.trim() || !message.trim()}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          {sending ? "Envoi en cours..." : "Envoyer l'e-mail"}
        </Button>
      </CardContent>
    </Card>
  );
};
