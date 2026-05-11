import { PhoneShowcase } from "../../components/PhoneShowcase";

export const ReportStep3 = () => (
  <PhoneShowcase
    step={3}
    badgeColor="#F59E0B"
    title="Recevez votre récompense"
    subtitle="2 000 Fr crédités dès la confirmation"
    screenshot="screenshots/demo.png"
    callouts={[
      { text: "2 000 Fr garantis", emoji: "💰", y: 0.55, side: "right", delay: 25 },
      { text: "Livraison disponible", emoji: "📦", y: 0.78, side: "left", delay: 35 },
    ]}
  />
);
