import { PhoneShowcase } from "../../components/PhoneShowcase";

export const NfcStep1 = () => (
  <PhoneShowcase
    step={1}
    badgeColor="#8B5CF6"
    title="Créez votre MCard"
    subtitle="Votre carte de visite digitale en 2 minutes"
    screenshot="screenshots/about.png"
    callouts={[
      { text: "Personnalisable", emoji: "🎨", y: 0.4, side: "right", delay: 25 },
      { text: "Profil pro", emoji: "💼", y: 0.7, side: "left", delay: 35 },
    ]}
  />
);
