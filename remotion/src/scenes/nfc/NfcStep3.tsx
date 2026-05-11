import { PhoneShowcase } from "../../components/PhoneShowcase";

export const NfcStep3 = () => (
  <PhoneShowcase
    step={3}
    badgeColor="#3B82F6"
    title="Partagez en NFC"
    subtitle="Un seul geste suffit pour transmettre vos contacts"
    screenshot="screenshots/home.png"
    callouts={[
      { text: "Tap & Share", emoji: "📱", y: 0.25, side: "right", delay: 25 },
      { text: "QR Code aussi", emoji: "🔳", y: 0.6, side: "left", delay: 35 },
      { text: "Aucune app requise", emoji: "✨", y: 0.85, side: "right", delay: 45 },
    ]}
  />
);
