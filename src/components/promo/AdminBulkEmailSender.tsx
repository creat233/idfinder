import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, FileText } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/integrations/supabase/client";

const cardRegistrationAnnouncementTemplate = {
  subject: "🎉 Nouvelle fonctionnalité : Sécurisez vos cartes sur FinderID !",
  message: `<h1>Ne perdez plus jamais vos documents importants !</h1>
<p>Bonjour,</p>
<p>Nous sommes ravis de vous présenter une nouvelle fonctionnalité essentielle sur FinderID pour vous aider à protéger vos cartes et documents importants : la possibilité d'enregistrer vos cartes pour recevoir des notifications.</p>
<h2>Comment ça marche ?</h2>
<p>C'est très simple :</p>
<ol>
  <li>Connectez-vous à votre compte et rendez-vous dans la section <strong>"Mes cartes"</strong>.</li>
  <li>Ajoutez les numéros de vos cartes d'identité, passeports, permis, etc.</li>
  <li>C'est tout ! Si quelqu'un signale un de vos documents comme trouvé, vous recevrez immédiatement une notification.</li>
</ol>
<p>Cette fonctionnalité vous permet de réagir rapidement et de récupérer vos biens en toute sérénité.</p>
<p style="text-align: center; margin: 24px 0;">
  <a href="https://finder-id-4182.lovable.app/my-cards" style="background-color: #9b87f5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Enregistrer mes cartes maintenant</a>
</p>
<p>N'attendez plus une minute pour sécuriser vos documents.</p>
<p>Merci de votre confiance.</p>
<p>L'équipe FinderID</p>
`
};

const promoCodeAnnouncementTemplate = {
  subject: "💰 Gagnez de l'argent et économisez avec les codes promo FinderID !",
  message: `<h1>Devenez partenaire FinderID et gagnez de l'argent !</h1>
<p>Bonjour,</p>
<p>Saviez-vous que vous pouvez non seulement économiser sur les frais de récupération de documents, mais aussi gagner de l'argent grâce à notre programme de codes promo ?</p>
<h2>Comment ça marche ?</h2>
<p>C'est très simple :</p>
<ol>
  <li>Rendez-vous dans la section <strong>"Codes Promo"</strong> de votre tableau de bord.</li>
  <li>Générez votre propre code promo unique.</li>
  <li>Partagez-le avec vos amis, votre famille et sur vos réseaux sociaux.</li>
  <li><strong>Chaque fois que quelqu'un utilise votre code, vous gagnez 1000 FCFA !</strong></li>
</ol>
<p>Non seulement vous aidez les autres à récupérer leurs documents à moindre coût, mais vous êtes également récompensé pour cela.</p>
<p style="text-align: center; margin: 24px 0;">
  <a href="https://finder-id-4182.lovable.app/promo-codes" style="background-color: #9b87f5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Générer mon code promo</a>
</p>
<p>Commencez à gagner de l'argent dès aujourd'hui tout en contribuant à notre communauté.</p>
<p>Merci de votre confiance.</p>
<p>L'équipe FinderID</p>
`
};

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
  
  const useCardRegistrationTemplate = () => {
    setSubject(cardRegistrationAnnouncementTemplate.subject);
    setMessage(cardRegistrationAnnouncementTemplate.message);
    showSuccess("Modèle chargé", "Le contenu de l'e-mail a été pré-rempli.");
  };

  const usePromoCodeTemplate = () => {
    setSubject(promoCodeAnnouncementTemplate.subject);
    setMessage(promoCodeAnnouncementTemplate.message);
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
            <Button variant="outline" size="sm" onClick={useCardRegistrationTemplate}>
              <FileText className="h-4 w-4 mr-2" />
              Annonce Enregistrement Carte
            </Button>
            <Button variant="outline" size="sm" onClick={usePromoCodeTemplate}>
              <FileText className="h-4 w-4 mr-2" />
              Annonce Codes Promo
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
