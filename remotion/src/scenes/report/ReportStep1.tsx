import { PhoneShowcase } from "../../components/PhoneShowcase";

export const ReportStep1 = () => (
  <PhoneShowcase
    step={1}
    badgeColor="#10B981"
    title="Signalez la trouvaille"
    subtitle="Remplissez le formulaire en 30 secondes"
    screenshot="screenshots/signaler.png"
    callouts={[
      { text: "Type de document", emoji: "🪪", y: 0.28, side: "right", delay: 25 },
      { text: "Lieu et date", emoji: "📍", y: 0.55, side: "left", delay: 35 },
      { text: "Envoyer", emoji: "🚀", y: 0.82, side: "right", delay: 45 },
    ]}
  />
);
