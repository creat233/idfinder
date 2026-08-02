import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { PhoneShowcase } from "../../components/PhoneShowcase";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

const GOLD = "#FBBF24";
const CYAN = "#22D3EE";


/* --- Minimal vector icons (no emoji font in the render sandbox) --- */
const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({ name, size = 44, color = "#fff" }) => {
  const paths: Record<string, string> = {
    cart: "M7 4h-2l-1 2h2l2.6 7.6L8 17h11v-2H9.4l.5-1.5H19l3-8H7.6L7 4Z",
    invoice: "M6 2h9l5 5v15H6V2Zm3 8h8v2H9v-2Zm0 4h8v2H9v-2Zm0 4h5v2H9v-2Z",
    chart: "M4 20h16v2H4v-2Zm2-8h3v7H6v-7Zm5-6h3v13h-3V6Zm5 3h3v10h-3V9Z",
    chat: "M4 4h16v12H9l-5 4V4Zm4 4h8v2H8V8Zm0 4h5v2H8v-2Z",
    star: "M12 2l3 6.5 7 .8-5.2 4.7 1.5 6.9L12 17.6 5.7 20.9l1.5-6.9L2 9.3l7-.8L12 2Z",
    megaphone: "M3 10v4h3l6 4V6L6 10H3Zm13-3.5a6 6 0 0 1 0 11v-2.2a3.8 3.8 0 0 0 0-6.6V6.5Z",
    shop: "M4 4h16l2 5H2l2-5Zm0 7h16v10H4V11Zm4 2v6h4v-6H8Z",
    card: "M2 5h20v14H2V5Zm2 3v2h16V8H4Zm0 5h7v2H4v-2Z",
    crown: "M2 8l4 4 6-8 6 8 4-4v11H2V8Z",
    truck: "M2 5h11v10H2V5Zm12 3h4l3 4v3h-7V8ZM6 17.5A1.5 1.5 0 1 0 6 20a1.5 1.5 0 0 0 0-2.5Zm11 0a1.5 1.5 0 1 0 0 2.5 1.5 1.5 0 0 0 0-2.5Z",
    box: "M3 7l9-4 9 4-9 4-9-4Zm0 3l9 4 9-4v7l-9 4-9-4v-7Z",
    money: "M2 6h20v12H2V6Zm10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
    badge: "M12 2l2.4 2.1 3.2-.4 1 3 2.8 1.6-1.3 3 1.3 3-2.8 1.6-1 3-3.2-.4L12 22l-2.4-2.1-3.2.4-1-3L2.6 15.7l1.3-3-1.3-3 2.8-1.6 1-3 3.2.4L12 2Z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d={paths[name] ?? paths.shop} />
    </svg>
  );
};

const useIn = (delay = 0, damping = 15) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping } });
  return {
    opacity: interpolate(frame, [delay, delay + 14], [0, 1], { extrapolateRight: "clamp" }),
    y: interpolate(s, [0, 1], [50, 0]),
    scale: interpolate(s, [0, 1], [0.85, 1]),
  };
};

/* ---------------- 1. HOOK ---------------- */
export const BoutiqueHook = () => {
  const frame = useCurrentFrame();
  const t1 = useIn(0);
  const t2 = useIn(18);
  const t3 = useIn(38, 9);
  const pulse = 1 + Math.sin(frame * 0.12) * 0.03;

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 70 }}>
      <div style={{ transform: `scale(${pulse})`, marginBottom: 34 }}>
        <Icon name="shop" size={140} color={CYAN} />
      </div>
      <div
        style={{
          fontSize: 62,
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          lineHeight: 1.15,
          opacity: t1.opacity,
          transform: `translateY(${t1.y}px)`,
        }}
      >
        Vendez en ligne{"\n"}dès aujourd'hui
      </div>
      <div
        style={{
          marginTop: 28,
          fontSize: 34,
          fontWeight: 600,
          color: CYAN,
          textAlign: "center",
          opacity: t2.opacity,
          transform: `translateY(${t2.y}px)`,
        }}
      >
        Créez votre boutique en ligne{"\n"}GRATUITEMENT avec Finder ID
      </div>
      <div
        style={{
          marginTop: 44,
          padding: "18px 34px",
          borderRadius: 999,
          border: `2px solid ${GOLD}`,
          background: "rgba(251,191,36,0.12)",
          color: GOLD,
          fontSize: 28,
          fontWeight: 700,
          opacity: t3.opacity,
          transform: `scale(${t3.scale})`,
        }}
      >
        Sans site web · Sans développeur
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 2. BOUTIQUE SHOWCASE ---------------- */
export const BoutiqueShop = () => (
  <PhoneShowcase
    step={1}
    badgeColor="#0EA5E9"
    title="Votre boutique en 3 minutes"
    subtitle="Produits, prix, photos, commandes"
    screenshot="screenshots/momo-products-clean.png"
    callouts={[
      { text: "Ajoutez vos produits", y: 0.2, side: "left", delay: 20 },
      { text: "Prix & stock en direct", y: 0.5, side: "right", delay: 40 },
      { text: "Commande WhatsApp", y: 0.78, side: "left", delay: 60 },
    ]}
  />
);

/* ---------------- 3. FEATURES LIST ---------------- */
const FEATURES: { icon: string; label: string }[] = [
  { icon: "cart", label: "Panier & commandes clients" },
  { icon: "invoice", label: "Factures et devis pro" },
  { icon: "chart", label: "Chiffre d'affaires & dépenses" },
  { icon: "chat", label: "Messagerie + Agent IA 24/7" },
  { icon: "star", label: "Avis clients & fidélité" },
  { icon: "megaphone", label: "Campagnes marketing" },
];

export const BoutiqueFeatures = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = useIn(0);

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", padding: 70 }}>
      <div
        style={{
          fontSize: 50,
          fontWeight: 800,
          color: "white",
          marginBottom: 44,
          opacity: head.opacity,
          transform: `translateY(${head.y}px)`,
        }}
      >
        Tout ce qu'il faut{"\n"}pour vendre
      </div>
      {FEATURES.map((f, i) => {
        const delay = 14 + i * 11;
        const s = spring({ frame: frame - delay, fps, config: { damping: 16 } });
        return (
          <div
            key={f.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "22px 26px",
              marginBottom: 16,
              borderRadius: 24,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              opacity: interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateX(${interpolate(s, [0, 1], [-70, 0])}px)`,
            }}
          >
            <span style={{ width: 52, display: "flex", justifyContent: "center" }}>
              <Icon name={f.icon} size={42} color={i % 2 === 0 ? CYAN : GOLD} />
            </span>
            <span style={{ fontSize: 31, fontWeight: 600, color: "white" }}>{f.label}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- 4. PLAN ESSENTIEL ---------------- */
const PlanScene: React.FC<{
  name: string;
  cards: string;
  accent: string;
  perks: string[];
  icon: string;
}> = ({ name, cards, accent, perks, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = useIn(0);
  const cardIn = spring({ frame: frame - 12, fps, config: { damping: 11 } });
  const glow = 30 + Math.sin(frame * 0.09) * 18;

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 70 }}>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 3,
          color: accent,
          opacity: head.opacity,
          transform: `translateY(${head.y}px)`,
        }}
      >
        PLAN {name.toUpperCase()}
      </div>

      <div
        style={{
          marginTop: 34,
          padding: "44px 40px",
          borderRadius: 40,
          width: "100%",
          textAlign: "center",
          background: "rgba(255,255,255,0.07)",
          border: `2px solid ${accent}`,
          boxShadow: `0 0 ${glow}px ${accent}55`,
          transform: `scale(${interpolate(cardIn, [0, 1], [0.8, 1])})`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
          <Icon name={icon} size={84} color={accent} />
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, color: "white", lineHeight: 1 }}>{cards}</div>
        <div style={{ fontSize: 34, fontWeight: 700, color: accent, marginTop: 10 }}>
          cartes de visite OFFERTES
        </div>
        <div style={{ fontSize: 26, color: "rgba(255,255,255,0.75)", marginTop: 14 }}>
          avec le QR code de votre boutique en ligne
        </div>
      </div>

      <div style={{ marginTop: 34, width: "100%" }}>
        {perks.map((p, i) => {
          const delay = 40 + i * 12;
          return (
            <div
              key={p}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 30,
                fontWeight: 600,
                color: "white",
                marginBottom: 14,
                opacity: interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp" }),
                transform: `translateY(${interpolate(
                  spring({ frame: frame - delay, fps, config: { damping: 16 } }),
                  [0, 1],
                  [26, 0]
                )}px)`,
              }}
            >
              <span style={{ color: accent }}>✔</span>
              {p}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const BoutiqueEssentiel = () => (
  <PlanScene
    name="Essentiel"
    cards="50"
    accent={CYAN}
    icon="card"
    perks={["Boutique en ligne illimitée", "QR code + partage NFC", "Factures & statistiques"]}
  />
);

export const BoutiquePremium = () => (
  <PlanScene
    name="Premium"
    cards="100"
    accent={GOLD}
    icon="crown"
    perks={["Toutes les fonctions Essentiel", "Agent IA & campagnes marketing", "Badge vérifié & fidélité clients"]}
  />
);

/* ---------------- 5. DELIVERY 24H ---------------- */
export const BoutiqueDelivery = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 10 } });
  const count = Math.round(interpolate(frame, [10, 45], [0, 24], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }));
  const sub = useIn(48);

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 70 }}>
      <div style={{ transform: `rotate(${interpolate(s, [0, 1], [-18, 0])}deg)`, marginBottom: 8 }}>
        <Icon name="truck" size={120} color={GOLD} />
      </div>
      <div
        style={{
          fontSize: 150,
          fontWeight: 800,
          color: GOLD,
          lineHeight: 1,
          transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
        }}
      >
        {count}h
      </div>
      <div style={{ fontSize: 44, fontWeight: 800, color: "white", marginTop: 10 }}>
        Délai de livraison
      </div>
      <div
        style={{
          marginTop: 26,
          fontSize: 30,
          fontWeight: 600,
          color: "rgba(255,255,255,0.8)",
          textAlign: "center",
          opacity: sub.opacity,
          transform: `translateY(${sub.y}px)`,
        }}
      >
        Vos cartes imprimées et livrées{"\n"}en seulement 24 heures
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 6. CTA ---------------- */
export const BoutiqueCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 12 } });
  const t1 = useIn(16);
  const t2 = useIn(34);
  const pulse = 1 + Math.sin(frame * 0.14) * 0.04;

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 70 }}>
      <div
        style={{
          width: 190,
          height: 190,
          borderRadius: 48,
          background: `linear-gradient(135deg, ${CYAN}, #6366F1)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 92,
          transform: `scale(${interpolate(logo, [0, 1], [0.4, 1])}) rotate(${interpolate(logo, [0, 1], [-20, 0])}deg)`,
          boxShadow: "0 24px 70px rgba(34,211,238,0.35)",
        }}
      >
        <Icon name="badge" size={100} color="#fff" />
      </div>
      <div
        style={{
          marginTop: 34,
          fontSize: 66,
          fontWeight: 800,
          color: "white",
          opacity: t1.opacity,
          transform: `translateY(${t1.y}px)`,
        }}
      >
        Finder ID
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 32,
          fontWeight: 600,
          color: "rgba(255,255,255,0.8)",
          textAlign: "center",
          opacity: t1.opacity,
        }}
      >
        Votre boutique. Votre carte.{"\n"}Vos clients.
      </div>
      <div
        style={{
          marginTop: 46,
          padding: "26px 52px",
          borderRadius: 999,
          background: GOLD,
          color: "#1F1300",
          fontSize: 34,
          fontWeight: 800,
          opacity: t2.opacity,
          transform: `scale(${pulse})`,
          boxShadow: "0 18px 50px rgba(251,191,36,0.4)",
        }}
      >
        finderid.info — Commencez gratuitement
      </div>
    </AbsoluteFill>
  );
};
