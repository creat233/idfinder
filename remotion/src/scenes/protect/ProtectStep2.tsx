import { PhoneShowcase } from "../../components/PhoneShowcase";

export const ProtectStep2 = () => (
  <PhoneShowcase
    step={2}
    badgeColor="#8B5CF6"
    title="Enregistrez vos documents"
    subtitle="Carte d'identité, passeport, permis…"
    screenshot="screenshots/signaler.png"
    callouts={[
      { text: "Tous types acceptés", emoji: "🪪", y: 0.28, side: "right", delay: 25 },
      { text: "Numéro et lieu", emoji: "📝", y: 0.55, side: "left", delay: 35 },
      { text: "Sauvegarde immédiate", emoji: "💾", y: 0.82, side: "right", delay: 45 },
    ]}
  />
);
