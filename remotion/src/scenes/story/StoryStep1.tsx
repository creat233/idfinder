import { PhoneShowcase } from "../../components/PhoneShowcase";

export const StoryStep1 = () => (
  <PhoneShowcase
    step={1}
    badgeColor="#EF4444"
    title="J'ai perdu mon passeport"
    subtitle="Amadou raconte son histoire"
    screenshot="screenshots/home.png"
    callouts={[
      { text: "Panique totale 😰", y: 0.3, side: "right", delay: 25 },
      { text: "Aéroport dans 24h", emoji: "✈️", y: 0.55, side: "left", delay: 35 },
    ]}
  />
);
