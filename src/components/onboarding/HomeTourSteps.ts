import { TourStep } from "@/hooks/useOnboardingTour";

export const homeTourSteps: TourStep[] = [
  {
    id: "welcome",
    icon: "👋",
    title: "Bienvenue sur Finder ID !",
    description:
      "Finder ID est votre application tout-en-un pour protéger vos documents d'identité et créer des cartes de visite digitales professionnelles. Laissez-nous vous guider !",
  },
  {
    id: "search",
    icon: "🔍",
    title: "Rechercher un document",
    description:
      "Vous avez perdu un document ? Utilisez la barre de recherche pour vérifier si quelqu'un l'a retrouvé et signalé sur Finder ID.",
  },
  {
    id: "report",
    icon: "📋",
    title: "Signaler un document trouvé",
    description:
      "Vous avez trouvé un document ? Signalez-le et gagnez 2 000 Fr de récompense une fois le document rendu à son propriétaire !",
  },
  {
    id: "mcard",
    icon: "💼",
    title: "MCard — Carte de visite digitale",
    description:
      "Créez votre carte de visite professionnelle avec boutique en ligne, partage NFC/QR, messagerie, factures et bien plus encore.",
  },
  {
    id: "protect",
    icon: "🛡️",
    title: "Protégez vos documents",
    description:
      "Enregistrez vos cartes d'identité, passeports et permis. En cas de perte, vous serez contacté automatiquement.",
  },
  {
    id: "community",
    icon: "🤝",
    title: "Rejoignez la communauté",
    description:
      "Créez votre compte gratuit pour accéder à toutes les fonctionnalités : protection de documents, MCard gratuite, et plus encore !",
  },
];

export const dashboardTourSteps: TourStep[] = [
  {
    id: "dashboard-welcome",
    icon: "🏠",
    title: "Votre tableau de bord",
    description:
      "Bienvenue dans votre espace personnel ! Ici vous pouvez gérer vos documents, vos MCards et suivre toutes vos activités.",
  },
  {
    id: "dashboard-cards",
    icon: "🪪",
    title: "Mes cartes d'identité",
    description:
      "Ajoutez et gérez vos documents d'identité. Ils seront protégés et vous serez notifié si quelqu'un les retrouve.",
  },
  {
    id: "dashboard-mcard",
    icon: "✨",
    title: "Ma MCard Business",
    description:
      "Accédez à votre carte de visite digitale, ajoutez des produits, gérez vos factures et développez votre activité.",
  },
  {
    id: "dashboard-messages",
    icon: "💬",
    title: "Messages & Notifications",
    description:
      "Restez connecté avec vos clients et la communauté. Recevez des alertes en temps réel pour chaque activité importante.",
  },
  {
    id: "dashboard-stats",
    icon: "📊",
    title: "Statistiques",
    description:
      "Suivez vos performances : vues de MCard, ventes, messages et bien plus. Tout est visible en un coup d'œil !",
  },
];
