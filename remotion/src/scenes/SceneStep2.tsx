import { PhoneShowcase } from "../components/PhoneShowcase";

export const SceneStep2 = () => (
  <PhoneShowcase
    step={2}
    badgeColor="#EC4899"
    title="Ajoutez vos produits"
    subtitle="Photos, prix, descriptions — tout en quelques clics"
    screenshot="screenshots/demo.png"
    callouts={[
      { text: "Catalogue illimité*", emoji: "🛍️", y: 0.55, side: "right", delay: 25 },
      { text: "Statistiques live", emoji: "📈", y: 0.78, side: "left", delay: 35 },
    ]}
  />
);
