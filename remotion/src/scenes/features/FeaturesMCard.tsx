import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const FeaturesMCard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const features = [
    { emoji: "🛍️", title: "Boutique en ligne", desc: "Vendez vos produits directement depuis votre MCard", color: "#F59E0B" },
    { emoji: "📊", title: "Analytics & Dashboard", desc: "Suivez vos performances en temps réel", color: "#8B5CF6" },
    { emoji: "🧾", title: "Factures & Devis", desc: "Créez des factures professionnelles automatiquement", color: "#10B981" },
    { emoji: "⭐", title: "Programme de fidélité", desc: "Fidélisez vos clients avec des points et récompenses", color: "#EC4899" },
  ];

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        opacity: titleOpacity, display: "flex", alignItems: "center", gap: 15, marginBottom: 40,
      }}>
        <span style={{ fontSize: 50 }}>💼</span>
        <h2 style={{ fontSize: 46, fontWeight: 700, color: "white", margin: 0 }}>
          MCard Business
        </h2>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, width: 880, justifyContent: "center" }}>
        {features.map((feat, i) => {
          const delay = 10 + i * 12;
          const s = spring({ frame: frame - delay, fps, config: { damping: 10 } });
          const o = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
          const floatY = interpolate(Math.sin(frame * 0.04 + i * 1.5), [-1, 1], [-4, 4]);

          return (
            <div key={i} style={{
              opacity: o,
              transform: `scale(${s}) translateY(${floatY}px)`,
              width: 420, background: "rgba(255,255,255,0.07)",
              borderRadius: 24, border: `1px solid ${feat.color}30`,
              padding: "30px 25px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center",
            }}>
              <div style={{
                width: 70, height: 70, borderRadius: 20,
                background: `${feat.color}20`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 36 }}>{feat.emoji}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, color: "white" }}>{feat.title}</div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>{feat.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
