import { PhoneShowcase } from "../components/PhoneShowcase";

export const SceneStep1 = () => (
  <PhoneShowcase
    step={1}
    badgeColor="#8B5CF6"
    title="Votre vitrine pro"
    subtitle="Exemple réel : Momo Design — boutique de tableaux"
    screenshot="screenshots/momo-hero.png"
    callouts={[
      { text: "Logo & nom de marque", emoji: "🎨", y: 0.32, side: "right", delay: 25 },
      { text: "Badge Vérifié + Plan", emoji: "✅", y: 0.55, side: "left", delay: 35 },
      { text: "Contact direct WhatsApp", emoji: "📞", y: 0.78, side: "right", delay: 50 },
    ]}
  />
);
