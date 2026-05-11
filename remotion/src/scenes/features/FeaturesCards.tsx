import { PhoneShowcase } from "../../components/PhoneShowcase";

export const FeaturesCards = () => (
  <PhoneShowcase
    step={1}
    badgeColor="#3B82F6"
    title="Cartes d'identité protégées"
    subtitle="Signalez et retrouvez en un clic"
    screenshot="screenshots/home.png"
    callouts={[
      { text: "Recherche rapide", emoji: "🔍", y: 0.2, side: "right", delay: 25 },
      { text: "Signalement facile", emoji: "📢", y: 0.55, side: "left", delay: 35 },
      { text: "Communauté active", emoji: "👥", y: 0.85, side: "right", delay: 45 },
    ]}
  />
);
