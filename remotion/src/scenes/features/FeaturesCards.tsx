import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const FeaturesCards = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const features = [
    { emoji: "🪪", title: "Signalement de documents", desc: "Signalez un document trouvé et gagnez 2 000 Fr", color: "#10B981" },
    { emoji: "🔍", title: "Recherche de cartes", desc: "Retrouvez vos documents perdus facilement", color: "#3B82F6" },
    { emoji: "🔔", title: "Alertes en temps réel", desc: "Notifications WhatsApp, email et push", color: "#F59E0B" },
    { emoji: "🤝", title: "Restitution sécurisée", desc: "Mise en relation sécurisée avec le propriétaire", color: "#EC4899" },
  ];

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        opacity: titleOpacity, display: "flex", alignItems: "center", gap: 15, marginBottom: 40,
      }}>
        <span style={{ fontSize: 50 }}>🛡️</span>
        <h2 style={{ fontSize: 46, fontWeight: 700, color: "white", margin: 0 }}>
          Protection des documents
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 880 }}>
        {features.map((feat, i) => {
          const delay = 10 + i * 12;
          const s = spring({ frame: frame - delay, fps, config: { damping: 12 } });
          const o = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
          const floatY = interpolate(Math.sin(frame * 0.04 + i), [-1, 1], [-3, 3]);

          return (
            <div key={i} style={{
              opacity: o,
              transform: `translateX(${interpolate(s, [0, 1], [i % 2 === 0 ? -60 : 60, 0])}px) translateY(${floatY}px)`,
              background: "rgba(255,255,255,0.07)",
              borderRadius: 24, border: `1px solid ${feat.color}30`,
              padding: "28px 35px",
              display: "flex", alignItems: "center", gap: 20,
            }}>
              <div style={{
                width: 70, height: 70, borderRadius: 20,
                background: `${feat.color}20`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: 36 }}>{feat.emoji}</span>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 600, color: "white" }}>{feat.title}</div>
                <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{feat.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
