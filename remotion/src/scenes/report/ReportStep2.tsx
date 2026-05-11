import { PhoneShowcase } from "../../components/PhoneShowcase";

export const ReportStep2 = () => (
  <PhoneShowcase
    step={2}
    badgeColor="#3B82F6"
    title="Le propriétaire est notifié"
    subtitle="Notre IA croise les bases en quelques secondes"
    screenshot="screenshots/home.png"
    callouts={[
      { text: "Recherche IA", emoji: "🤖", y: 0.18, side: "right", delay: 25 },
      { text: "Notification instantanée", emoji: "🔔", y: 0.5, side: "left", delay: 35 },
      { text: "Communauté Finder ID", emoji: "👥", y: 0.78, side: "right", delay: 45 },
    ]}
  />
);
