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
  christmasWishesTemplate,
  koriteWishesTemplate,
  magalDeToubaWishesTemplate,
  mawlidWishesTemplate,
  assumptionDayWishesTemplate,
  allSaintsDayWishesTemplate,
  peaceDayWishesTemplate,
} from "./";

export interface EmailTemplate {
  id: string;
  template: { subject: string; message: string };
  label: string;
  contexts: ('bulk' | 'single')[];
}

export interface TemplateCategory {
  name: string;
  templates: EmailTemplate[];
}

export const templateCategories: TemplateCategory[] = [
  {
    name: "Annonces & Mises à jour",
    templates: [
      { id: "cardRegistration", template: cardRegistrationAnnouncementTemplate, label: "Annonce Enregistrement Carte", contexts: ['bulk'] },
      { id: "featureUpdate", template: featureUpdateTemplate, label: "Mise à Jour Fonctionnalité", contexts: ['bulk'] },
      { id: "partnershipAnnouncement", template: partnershipAnnouncementTemplate, label: "Annonce Partenariat", contexts: ['bulk'] },
      { id: "successStory", template: successStoryTemplate, label: "Histoire de Réussite", contexts: ['bulk', 'single'] },
    ]
  },
  {
    name: "Marketing & Promotions",
    templates: [
      { id: "promoCodeAnnouncement", template: promoCodeAnnouncementTemplate, label: "Annonce Codes Promo", contexts: ['bulk'] },
      { id: "specialPromotion", template: specialPromotionTemplate, label: "Promo Spéciale", contexts: ['bulk'] },
      { id: "referralProgramReminder", template: referralProgramReminderTemplate, label: "Rappel Parrainage", contexts: ['bulk', 'single'] },
      { id: "promoCodeEarning", template: promoCodeEarningTemplate, label: "Revenus Code Promo", contexts: ['bulk', 'single'] },
    ]
  },
  {
    name: "Engagement & Astuces",
    templates: [
      { id: "tipsAndTricks", template: tipsAndTricksTemplate, label: "Astuces & Conseils", contexts: ['bulk'] },
      { id: "feedbackRequest", template: feedbackRequestTemplate, label: "Demande de Feedback", contexts: ['bulk', 'single'] },
      { id: "userSatisfactionSurvey", template: userSatisfactionSurveyTemplate, label: "Sondage Satisfaction", contexts: ['bulk'] },
      { id: "communityGuide", template: communityGuideTemplate, label: "Guide Communauté", contexts: ['bulk'] },
      { id: "monthlyRecap", template: monthlyRecapTemplate, label: "Récap Mensuel", contexts: ['bulk'] },
    ]
  },
  {
    name: "Fêtes & Événements",
    templates: [
      { id: "holidayWishes", template: holidayWishesTemplate, label: "Vœux", contexts: ['bulk'] },
      { id: "newYearWishes", template: newYearWishesTemplate, label: "Nouvel An", contexts: ['bulk'] },
      { id: "christmasWishes", template: christmasWishesTemplate, label: "Noël", contexts: ['bulk'] },
      { id: "easterWishes", template: easterWishesTemplate, label: "Pâques", contexts: ['bulk'] },
      { id: "assumptionDayWishes", template: assumptionDayWishesTemplate, label: "Assomption", contexts: ['bulk'] },
      { id: "allSaintsDayWishes", template: allSaintsDayWishesTemplate, label: "Toussaint", contexts: ['bulk'] },
      { id: "ramadanWishes", template: ramadanWishesTemplate, label: "Ramadan", contexts: ['bulk'] },
      { id: "koriteWishes", template: koriteWishesTemplate, label: "Korité", contexts: ['bulk'] },
      { id: "tabaskiWishes", template: tabaskiWishesTemplate, label: "Tabaski", contexts: ['bulk'] },
      { id: "mawlidWishes", template: mawlidWishesTemplate, label: "Mawlid (Gamou)", contexts: ['bulk'] },
      { id: "magalDeToubaWishes", template: magalDeToubaWishesTemplate, label: "Magal de Touba", contexts: ['bulk'] },
      { id: "fathersDayWishes", template: fathersDayWishesTemplate, label: "Fête des Pères", contexts: ['bulk'] },
      { id: "mothersDayWishes", template: mothersDayWishesTemplate, label: "Fête des Mères", contexts: ['bulk'] },
      { id: "laborDayWishes", template: laborDayWishesTemplate, label: "Fête du Travail", contexts: ['bulk'] },
      { id: "valentinesDayWishes", template: valentinesDayWishesTemplate, label: "Saint-Valentin", contexts: ['bulk'] },
      { id: "womensDayWishes", template: womensDayWishesTemplate, label: "Journée de la Femme", contexts: ['bulk'] },
      { id: "independenceDayWishes", template: independenceDayWishesTemplate, label: "Fête Indépendance", contexts: ['bulk'] },
      { id: "peaceDayWishes", template: peaceDayWishesTemplate, label: "Journée de la Paix", contexts: ['bulk'] },
    ]
  },
  {
    name: "Cycle de vie & Personnalisés",
    templates: [
      { id: "welcomeEmail", template: welcomeEmailTemplate, label: "E-mail de Bienvenue", contexts: ['single'] },
      { id: "inactivityReminder", template: inactivityReminderTemplate, label: "Rappel d'Inactivité", contexts: ['bulk', 'single'] },
      { id: "birthdayWishes", template: birthdayWishesTemplate, label: "Anniversaire", contexts: ['single'] },
      { id: "accountAnniversary", template: accountAnniversaryTemplate, label: "Anniversaire Compte", contexts: ['single'] },
      { id: "documentExpirationReminder", template: documentExpirationReminderTemplate, label: "Rappel Expiration Document", contexts: ['single'] },
      { id: "yearlyRecap", template: yearlyRecapTemplate, label: "Bilan Annuel", contexts: ['single'] },
    ]
  },
  {
    name: "Sécurité & Administratif",
    templates: [
      { id: "securityReminder", template: securityReminderTemplate, label: "Rappel de Sécurité", contexts: ['bulk'] },
      { id: "securityAlert", template: securityAlertTemplate, label: "Alerte Sécurité", contexts: ['bulk', 'single'] },
      { id: "termsUpdate", template: termsUpdateTemplate, label: "Mise à jour CGU", contexts: ['bulk'] },
    ]
  },
];
