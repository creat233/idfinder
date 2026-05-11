import { PhoneShowcase } from "../../components/PhoneShowcase";

export const StoryStep3 = () => (
  <PhoneShowcase
    step={3}
    badgeColor="#10B981"
    title="Récupéré le jour même"
    subtitle="Merci à la communauté Finder ID 🙏"
    screenshot="screenshots/support.png"
    callouts={[
      { text: "Support 24/7", emoji: "💬", y: 0.45, side: "right", delay: 25 },
      { text: "Communauté solidaire", emoji: "❤️", y: 0.75, side: "left", delay: 35 },
    ]}
  />
);
