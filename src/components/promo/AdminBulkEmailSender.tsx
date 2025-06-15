
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, FileText } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/integrations/supabase/client";
import {
  cardRegistrationAnnouncementTemplate,
  promoCodeAnnouncementTemplate,
  welcomeEmailTemplate,
  inactivityReminderTemplate,
  feedbackRequestTemplate,
  securityReminderTemplate,
  tipsAndTricksTemplate,
  monthlyRecapTemplate,
  specialPromotionTemplate,
  termsUpdateTemplate,
  partnershipAnnouncementTemplate,
  holidayWishesTemplate,
  newYearWishesTemplate,
  easterWishesTemplate,
  tabaskiWishesTemplate,
  ramadanWishesTemplate,
  userSatisfactionSurveyTemplate,
  securityAlertTemplate,
  featureUpdateTemplate,
  accountAnniversaryTemplate,
  referralProgramReminderTemplate
} from "./emailTemplates";

export const AdminBulkEmailSender = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSendEmails = async () => {
    if (!subject.trim() || !message.trim()) {
      showError("Champs requis", "Veuillez remplir le sujet et le message.");
      return;
    }

    setSending(true);
    try {
      // On autorise le HTML dans le message pour plus de flexibilité
      const { error } = await supabase.functions.invoke('send-bulk-email', {
        body: { subject, htmlContent: message },
      });

      if (error) {
        throw new Error(error.message);
      }

      showSuccess("E-mails en cours d'envoi", "Les e-mails sont en train d'être envoyés à tous les utilisateurs.");
      setSubject("");
      setMessage("");
    } catch (error: any) {
      console.error("Error sending bulk emails:", error);
      showError("Erreur d'envoi", error.message || "Une erreur s'est produite lors de l'envoi des e-mails.");
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
            Envoyer un e-mail à tous les utilisateurs
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button variant="outline" size="sm" onClick={() => useTemplate(cardRegistrationAnnouncementTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Annonce Enregistrement Carte
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(promoCodeAnnouncementTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Annonce Codes Promo
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(welcomeEmailTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              E-mail de Bienvenue
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(inactivityReminderTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Rappel d'Inactivité
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(feedbackRequestTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Demande de Feedback
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(securityReminderTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Rappel de Sécurité
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(tipsAndTricksTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Astuces & Conseils
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(monthlyRecapTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Récap Mensuel
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(specialPromotionTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Promo Spéciale
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(termsUpdateTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Mise à jour CGU
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(partnershipAnnouncementTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Annonce Partenariat
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(holidayWishesTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Vœux
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(newYearWishesTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Nouvel An
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(easterWishesTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Pâques
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(tabaskiWishesTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Tabaski
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(ramadanWishesTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Ramadan
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(userSatisfactionSurveyTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Sondage Satisfaction
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(securityAlertTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Alerte Sécurité
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(featureUpdateTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Mise à Jour Fonctionnalité
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(accountAnniversaryTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Anniversaire Compte
            </Button>
            <Button variant="outline" size="sm" onClick={() => useTemplate(referralProgramReminderTemplate)}>
              <FileText className="h-4 w-4 mr-2" />
              Rappel Parrainage
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-subject">Sujet de l'e-mail</Label>
          <Input
            id="email-subject"
            placeholder="Ex: Nouvelle fonctionnalité sur FinderID !"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-message">Message (HTML supporté)</Label>
          <Textarea
            id="email-message"
            placeholder="Écrivez votre message ici. Vous pouvez utiliser des balises HTML comme <b>, <p>, <a>, etc."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
          />
        </div>
        <Button
          onClick={handleSendEmails}
          disabled={sending || !subject.trim() || !message.trim()}
          className="w-full"
          size="lg"
        >
          <Send className="h-4 w-4 mr-2" />
          {sending ? "Envoi en cours..." : "Envoyer l'e-mail de masse"}
        </Button>
      </CardContent>
    </Card>
  );
};
