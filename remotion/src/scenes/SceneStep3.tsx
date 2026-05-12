import { PhoneShowcase } from "../components/PhoneShowcase";

export const SceneStep3 = () => (
  <PhoneShowcase
    step={3}
    badgeColor="#10B981"
    title="Vos clients commandent"
    subtitle="Panier, partage, contact direct — en 1 tap"
    screenshot="screenshots/momo-products2.png"
    callouts={[
      { text: "Partager le produit", emoji: "🔗", y: 0.46, side: "left", delay: 20 },
      { text: "Ajouter au panier", emoji: "🛒", y: 0.5, side: "right", delay: 30 },
      { text: "Lire / contacter", emoji: "💬", y: 0.92, side: "right", delay: 45 },
    ]}
  />
);
