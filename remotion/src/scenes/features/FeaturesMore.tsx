import { PhoneShowcase } from "../../components/PhoneShowcase";

export const FeaturesMore = () => (
  <PhoneShowcase
    step={3}
    badgeColor="#EF4444"
    title="Numéros d'urgence intégrés"
    subtitle="Police, médical, pompiers — toujours à portée"
    screenshot="screenshots/urgence.png"
    callouts={[
      { text: "24h / 24 et 7j / 7", emoji: "🚨", y: 0.32, side: "right", delay: 25 },
      { text: "Filtres par catégorie", emoji: "🏷️", y: 0.55, side: "left", delay: 35 },
      { text: "Appel direct", emoji: "📞", y: 0.78, side: "right", delay: 45 },
    ]}
  />
);
