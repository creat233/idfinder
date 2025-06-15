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

const welcomeEmailTemplate = {
  subject: "Bienvenue sur FinderID ! 🎉 Prêt à sécuriser vos documents ?",
  message: `<h1>Bienvenue dans la communauté FinderID !</h1>
<p>Bonjour,</p>
<p>Merci de nous avoir rejoints ! Vous avez fait le premier pas pour ne plus jamais perdre vos documents importants.</p>
<h2>Que faire maintenant ?</h2>
<p>La première étape est simple et rapide :</p>
<ol>
  <li>Rendez-vous dans la section <strong>"Mes cartes"</strong>.</li>
  <li>Ajoutez votre premier document (carte d'identité, passeport, etc.).</li>
</ol>
<p>Une fois vos documents enregistrés, vous serez immédiatement notifié si quelqu'un les retrouve.</p>
<p style="text-align: center; margin: 24px 0;">
  <a href="https://finder-id-4182.lovable.app/my-cards" style="background-color: #9b87f5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Ajouter mon premier document</a>
</p>
<p>Si vous avez des questions, n'hésitez pas à consulter notre <a href="https://finder-id-4182.lovable.app/support">page d'aide</a>.</p>
<p>L'équipe FinderID</p>
`
};

const inactivityReminderTemplate = {
  subject: "🤔 On ne vous voit plus sur FinderID...",
  message: `<h1>Ça fait un bail !</h1>
<p>Bonjour,</p>
<p>Nous avons remarqué que vous n'êtes pas venu sur FinderID depuis un moment. Vos documents sont-ils toujours à jour ?</p>
<p>Assurer la sécurité de vos biens est notre priorité. N'oubliez pas que vous pouvez :</p>
<ul>
  <li><strong>Ajouter de nouveaux documents</strong> à tout moment.</li>
  <li><strong>Générer un code promo</strong> pour gagner de l'argent en aidant les autres.</li>
</ul>
<p>Revenez nous voir pour vous assurer que tout est en ordre !</p>
<p style="text-align: center; margin: 24px 0;">
  <a href="https://finder-id-4182.lovable.app/dashboard" style="background-color: #9b87f5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Accéder à mon tableau de bord</a>
</p>
<p>À très bientôt !</p>
<p>L'équipe FinderID</p>
`
};

const feedbackRequestTemplate = {
  subject: "Votre avis compte ! Aidez-nous à améliorer FinderID.",
  message: `<h1>On a besoin de vous !</h1>
<p>Bonjour,</p>
<p>Chez FinderID, nous travaillons constamment à améliorer notre service pour vous offrir la meilleure expérience possible. Et pour cela, votre avis est essentiel !</p>
<p>Qu'est-ce que vous aimez sur FinderID ? Y a-t-il quelque chose que nous pourrions améliorer ? Une fonctionnalité que vous aimeriez voir ?</p>
<p>Prenez quelques instants pour nous faire part de vos suggestions en répondant simplement à cet e-mail. Chaque retour est lu et pris en compte.</p>
<p>Merci de nous aider à construire un meilleur FinderID, ensemble.</p>
<p>L'équipe FinderID</p>
`
};

const securityReminderTemplate = {
  subject: "🔒 Un rappel important sur la sécurité de votre compte FinderID",
  message: `<h1>Votre sécurité est notre priorité</h1>
<p>Bonjour,</p>
<p>Pour garantir que votre compte et vos informations personnelles restent en sécurité, nous aimerions vous rappeler quelques bonnes pratiques essentielles :</p>
<ul>
  <li><strong>Utilisez un mot de passe fort et unique</strong> que vous n'utilisez sur aucun autre site.</li>
  <li><strong>Ne partagez jamais vos informations de connexion</strong> avec qui que ce soit. L'équipe FinderID ne vous demandera jamais votre mot de passe.</li>
  <li><strong>Méfiez-vous des e-mails de phishing</strong>. Vérifiez toujours que l'expéditeur est bien légitime avant de cliquer sur un lien.</li>
</ul>
<p>La sécurité de vos données est une responsabilité partagée. Merci de nous aider à protéger votre compte.</p>
<p style="text-align: center; margin: 24px 0;">
  <a href="https://finder-id-4182.lovable.app/profile" style="background-color: #9b87f5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Vérifier mes paramètres</a>
</p>
<p>L'équipe FinderID</p>
`
};

const tipsAndTricksTemplate = {
  subject: "💡 Tirez le meilleur parti de votre compte FinderID !",
  message: `<h1>Astuces pour maîtriser FinderID</h1>
<p>Bonjour,</p>
<p>Saviez-vous que vous pouviez faire bien plus que simplement enregistrer votre carte d'identité ? Voici quelques astuces pour devenir un pro de FinderID :</p>
<ul>
  <li><strong>Enregistrez tout ce qui est important :</strong> Pensez à vos clés, votre téléphone, vos cartes bancaires, ou même votre animal de compagnie avec un QR code sur son collier !</li>
  <li><strong>Partagez votre code promo :</strong> Chaque utilisation de votre code vous rapporte de l'argent. Partagez-le sur vos réseaux sociaux pour maximiser vos gains !</li>
  <li><strong>Gardez vos informations à jour :</strong> Un numéro de téléphone ou une adresse e-mail à jour est crucial pour que nous puissions vous contacter si l'un de vos biens est retrouvé.</li>
</ul>
<p>Explorez votre tableau de bord pour découvrir toutes les fonctionnalités à votre disposition.</p>
<p style="text-align: center; margin: 24px 0;">
  <a href="https://finder-id-4182.lovable.app/dashboard" style="background-color: #9b87f5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explorer le tableau de bord</a>
</p>
<p>L'équipe FinderID</p>
`
};

const monthlyRecapTemplate = {
  subject: "📰 Votre récapitulatif FinderID !",
  message: `<h1>Quoi de neuf sur FinderID ?</h1>
<p>Bonjour,</p>
<p>Voici un résumé de ce qui s'est passé sur FinderID récemment et des fonctionnalités que vous avez peut-être manquées.</p>
<h2>Nouveautés :</h2>
<p><em>[Pensez à remplacer ce contenu par les vraies nouveautés]</em></p>
<ul>
  <li><strong>Fonctionnalité A :</strong> Nous avons amélioré la vitesse de recherche.</li>
  <li><strong>Partenariat B :</strong> Retrouvez nos services dans de nouveaux points relais.</li>
</ul>
<h2>Le saviez-vous ?</h2>
<p>Vous pouvez maintenant ajouter des photos à vos documents pour une identification plus facile.</p>
<p style="text-align: center; margin: 24px 0;">
  <a href="https://finder-id-4182.lovable.app/dashboard" style="background-color: #9b87f5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explorer mon tableau de bord</a>
</p>
<p>Restez à l'écoute pour d'autres améliorations !</p>
<p>L'équipe FinderID</p>
`
};

const specialPromotionTemplate = {
  subject: "🎉 Offre Spéciale : Économisez sur les frais de récupération !",
  message: `<h1>Une offre à ne pas manquer !</h1>
<p>Bonjour,</p>
<p>Pour une durée limitée, nous avons une promotion spéciale pour vous !</p>
<p><strong>Bénéficiez de 50% de réduction sur les frais de récupération pour tous les documents signalés cette semaine !</strong></p>
<p>C'est le moment ou jamais d'encourager vos proches à utiliser FinderID. Partagez votre code promo et aidez-les à économiser encore plus.</p>
<p style="text-align: center; margin: 24px 0;">
  <a href="https://finder-id-4182.lovable.app/promo-codes" style="background-color: #9b87f5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Partager mon code promo</a>
</p>
<p>L'offre est valable jusqu'au [Date d'expiration].</p>
<p>Merci de faire partie de notre communauté.</p>
<p>L'équipe FinderID</p>
`;

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

  const useWelcomeEmailTemplate = () => {
    setSubject(welcomeEmailTemplate.subject);
    setMessage(welcomeEmailTemplate.message);
    showSuccess("Modèle chargé", "Le contenu de l'e-mail a été pré-rempli.");
  };

  const useInactivityReminderTemplate = () => {
    setSubject(inactivityReminderTemplate.subject);
    setMessage(inactivityReminderTemplate.message);
    showSuccess("Modèle chargé", "Le contenu de l'e-mail a été pré-rempli.");
  };

  const useFeedbackRequestTemplate = () => {
    setSubject(feedbackRequestTemplate.subject);
    setMessage(feedbackRequestTemplate.message);
    showSuccess("Modèle chargé", "Le contenu de l'e-mail a été pré-rempli.");
  };

  const useSecurityReminderTemplate = () => {
    setSubject(securityReminderTemplate.subject);
    setMessage(securityReminderTemplate.message);
    showSuccess("Modèle chargé", "Le contenu de l'e-mail a été pré-rempli.");
  };

  const useTipsAndTricksTemplate = () => {
    setSubject(tipsAndTricksTemplate.subject);
    setMessage(tipsAndTricksTemplate.message);
    showSuccess("Modèle chargé", "Le contenu de l'e-mail a été pré-rempli.");
  };

  const useMonthlyRecapTemplate = () => {
    setSubject(monthlyRecapTemplate.subject);
    setMessage(monthlyRecapTemplate.message);
    showSuccess("Modèle chargé", "Le contenu de l'e-mail a été pré-rempli.");
  };

  const useSpecialPromotionTemplate = () => {
    setSubject(specialPromotionTemplate.subject);
    setMessage(specialPromotionTemplate.message);
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
            <Button variant="outline" size="sm" onClick={useWelcomeEmailTemplate}>
              <FileText className="h-4 w-4 mr-2" />
              E-mail de Bienvenue
            </Button>
            <Button variant="outline" size="sm" onClick={useInactivityReminderTemplate}>
              <FileText className="h-4 w-4 mr-2" />
              Rappel d'Inactivité
            </Button>
            <Button variant="outline" size="sm" onClick={useFeedbackRequestTemplate}>
              <FileText className="h-4 w-4 mr-2" />
              Demande de Feedback
            </Button>
            <Button variant="outline" size="sm" onClick={useSecurityReminderTemplate}>
              <FileText className="h-4 w-4 mr-2" />
              Rappel de Sécurité
            </Button>
            <Button variant="outline" size="sm" onClick={useTipsAndTricksTemplate}>
              <FileText className="h-4 w-4 mr-2" />
              Astuces & Conseils
            </Button>
            <Button variant="outline" size="sm" onClick={useMonthlyRecapTemplate}>
              <FileText className="h-4 w-4 mr-2" />
              Récap Mensuel
            </Button>
            <Button variant="outline" size="sm" onClick={useSpecialPromotionTemplate}>
              <FileText className="h-4 w-4 mr-2" />
              Promo Spéciale
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
