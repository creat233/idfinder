import { PhoneShowcase } from "../components/PhoneShowcase";

export const SceneStep3 = () => (
  <PhoneShowcase
    step={3}
    badgeColor="#10B981"
    title="Vendez et encaissez"
    subtitle="Commandes, messages, paiements — centralisés"
    screenshot="screenshots/home.png"
    callouts={[
      { text: "Messages clients", emoji: "💬", y: 0.85, side: "right", delay: 25 },
      { text: "Notifications live", emoji: "🔔", y: 0.92, side: "left", delay: 35 },
    ]}
  />
);
