import { PhoneShowcase } from "../../components/PhoneShowcase";

export const ProtectStep1 = () => (
  <PhoneShowcase
    step={1}
    badgeColor="#3B82F6"
    title="Créez votre compte"
    subtitle="Inscription gratuite et sécurisée"
    screenshot="screenshots/auth.png"
    callouts={[
      { text: "Connexion sécurisée", emoji: "🔐", y: 0.32, side: "right", delay: 25 },
      { text: "Mot de passe protégé", emoji: "🛡️", y: 0.55, side: "left", delay: 35 },
    ]}
  />
);
