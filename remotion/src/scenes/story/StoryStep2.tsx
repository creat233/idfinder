import { PhoneShowcase } from "../../components/PhoneShowcase";

export const StoryStep2 = () => (
  <PhoneShowcase
    step={2}
    badgeColor="#F59E0B"
    title="Quelqu'un l'a signalé !"
    subtitle="Notification reçue 3 heures plus tard"
    screenshot="screenshots/signaler.png"
    callouts={[
      { text: "Document trouvé", emoji: "🎯", y: 0.18, side: "right", delay: 25 },
      { text: "Lieu précis", emoji: "📍", y: 0.55, side: "left", delay: 35 },
    ]}
  />
);
