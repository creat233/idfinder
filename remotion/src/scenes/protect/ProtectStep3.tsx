import { PhoneShowcase } from "../../components/PhoneShowcase";

export const ProtectStep3 = () => (
  <PhoneShowcase
    step={3}
    badgeColor="#10B981"
    title="Soyez alerté instantanément"
    subtitle="Notification dès qu'un document est retrouvé"
    screenshot="screenshots/home.png"
    callouts={[
      { text: "Carte signalée ✓", emoji: "🟢", y: 0.78, side: "right", delay: 20 },
      { text: "Notification envoyée", emoji: "🔔", y: 0.85, side: "left", delay: 35 },
    ]}
  />
);
