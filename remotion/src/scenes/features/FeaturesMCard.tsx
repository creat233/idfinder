import { PhoneShowcase } from "../../components/PhoneShowcase";

export const FeaturesMCard = () => (
  <PhoneShowcase
    step={2}
    badgeColor="#8B5CF6"
    title="MCard digitale & NFC"
    subtitle="Votre carte de visite professionnelle"
    screenshot="screenshots/about.png"
    callouts={[
      { text: "Profil pro", emoji: "💼", y: 0.35, side: "right", delay: 25 },
      { text: "Boutique intégrée", emoji: "🛍️", y: 0.7, side: "left", delay: 35 },
    ]}
  />
);
