import { PhoneShowcase } from "../components/PhoneShowcase";

export const SceneStep1 = () => (
  <PhoneShowcase
    step={1}
    badgeColor="#8B5CF6"
    title="Lancez votre boutique"
    subtitle="Créez votre MCard professionnelle"
    screenshot="screenshots/about.png"
    callouts={[
      { text: "Inscription gratuite", emoji: "✨", y: 0.4, side: "right", delay: 25 },
      { text: "Profil sur-mesure", emoji: "🎨", y: 0.7, side: "left", delay: 35 },
    ]}
  />
);
