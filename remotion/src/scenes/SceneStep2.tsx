import { PhoneShowcase } from "../components/PhoneShowcase";

export const SceneStep2 = () => (
  <PhoneShowcase
    step={2}
    badgeColor="#EC4899"
    title="Vos produits en ligne"
    subtitle="Photos HD, prix, descriptions — visibles 24/7"
    screenshot="screenshots/momo-products.png"
    callouts={[
      { text: "Catalogue Produits & Services", emoji: "🛍️", y: 0.42, side: "right", delay: 20 },
      { text: "Photo HD du produit", emoji: "📸", y: 0.55, side: "left", delay: 35 },
      { text: "Prix mis en avant", emoji: "💰", y: 0.78, side: "right", delay: 50 },
    ]}
  />
);
