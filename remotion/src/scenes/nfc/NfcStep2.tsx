import { PhoneShowcase } from "../../components/PhoneShowcase";

export const NfcStep2 = () => (
  <PhoneShowcase
    step={2}
    badgeColor="#EC4899"
    title="Personnalisez votre profil"
    subtitle="Ajoutez photo, services, produits, statuts"
    screenshot="screenshots/demo.png"
    callouts={[
      { text: "Statistiques live", emoji: "📊", y: 0.55, side: "right", delay: 25 },
      { text: "Boutique intégrée", emoji: "🛍️", y: 0.78, side: "left", delay: 35 },
    ]}
  />
);
