
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
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
  referralProgramReminderTemplate,
  documentExpirationReminderTemplate,
  successStoryTemplate,
  birthdayWishesTemplate,
  communityGuideTemplate,
  yearlyRecapTemplate,
  promoCodeEarningTemplate,
  fathersDayWishesTemplate,
  mothersDayWishesTemplate,
  laborDayWishesTemplate,
  valentinesDayWishesTemplate,
  womensDayWishesTemplate,
  independenceDayWishesTemplate,
} from "./email-templates";

interface EmailTemplateSelectorProps {
  useTemplate: (template: { subject: string; message: string }) => void;
}

const templateList = [
  { id: "cardRegistration", template: cardRegistrationAnnouncementTemplate, label: "Annonce Enregistrement Carte" },
  { id: "promoCodeAnnouncement", template: promoCodeAnnouncementTemplate, label: "Annonce Codes Promo" },
  { id: "welcomeEmail", template: welcomeEmailTemplate, label: "E-mail de Bienvenue" },
  { id: "inactivityReminder", template: inactivityReminderTemplate, label: "Rappel d'Inactivité" },
  { id: "feedbackRequest", template: feedbackRequestTemplate, label: "Demande de Feedback" },
  { id: "securityReminder", template: securityReminderTemplate, label: "Rappel de Sécurité" },
  { id: "tipsAndTricks", template: tipsAndTricksTemplate, label: "Astuces & Conseils" },
  { id: "monthlyRecap", template: monthlyRecapTemplate, label: "Récap Mensuel" },
  { id: "specialPromotion", template: specialPromotionTemplate, label: "Promo Spéciale" },
  { id: "termsUpdate", template: termsUpdateTemplate, label: "Mise à jour CGU" },
  { id: "partnershipAnnouncement", template: partnershipAnnouncementTemplate, label: "Annonce Partenariat" },
  { id: "holidayWishes", template: holidayWishesTemplate, label: "Vœux" },
  { id: "newYearWishes", template: newYearWishesTemplate, label: "Nouvel An" },
  { id: "easterWishes", template: easterWishesTemplate, label: "Pâques" },
  { id: "tabaskiWishes", template: tabaskiWishesTemplate, label: "Tabaski" },
  { id: "ramadanWishes", template: ramadanWishesTemplate, label: "Ramadan" },
  { id: "userSatisfactionSurvey", template: userSatisfactionSurveyTemplate, label: "Sondage Satisfaction" },
  { id: "securityAlert", template: securityAlertTemplate, label: "Alerte Sécurité" },
  { id: "featureUpdate", template: featureUpdateTemplate, label: "Mise à Jour Fonctionnalité" },
  { id: "accountAnniversary", template: accountAnniversaryTemplate, label: "Anniversaire Compte" },
  { id: "referralProgramReminder", template: referralProgramReminderTemplate, label: "Rappel Parrainage" },
  { id: "documentExpirationReminder", template: documentExpirationReminderTemplate, label: "Rappel Expiration Document" },
  { id: "successStory", template: successStoryTemplate, label: "Histoire de Réussite" },
  { id: "birthdayWishes", template: birthdayWishesTemplate, label: "Vœux Anniversaire" },
  { id: "communityGuide", template: communityGuideTemplate, label: "Guide Communauté" },
  { id: "yearlyRecap", template: yearlyRecapTemplate, label: "Bilan Annuel" },
  { id: "promoCodeEarning", template: promoCodeEarningTemplate, label: "Revenus Code Promo" },
  { id: "fathersDayWishes", template: fathersDayWishesTemplate, label: "Fête des Pères" },
  { id: "mothersDayWishes", template: mothersDayWishesTemplate, label: "Fête des Mères" },
  { id: "laborDayWishes", template: laborDayWishesTemplate, label: "Fête du Travail" },
  { id: "valentinesDayWishes", template: valentinesDayWishesTemplate, label: "Saint-Valentin" },
  { id: "womensDayWishes", template: womensDayWishesTemplate, label: "Journée de la Femme" },
  { id: "independenceDayWishes", template: independenceDayWishesTemplate, label: "Fête Indépendance" },
];

export const EmailTemplateSelector = ({ useTemplate }: EmailTemplateSelectorProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {templateList.map(({ id, template, label }) => (
        <Button
          key={id}
          variant="outline"
          size="sm"
          onClick={() => useTemplate(template)}
        >
          <FileText className="h-4 w-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );
};
