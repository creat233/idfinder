import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const FeaturesMore = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const features = [
    { emoji: "📱", title: "NFC & QR Code", desc: "Partagez votre profil d'un tap", color: "#3B82F6" },
    { emoji: "📢", title: "Campagnes Marketing", desc: "Envoyez des promos à vos clients", color: "#EF4444" },
    { emoji: "💬", title: "Messagerie intégrée", desc: "Communiquez avec vos clients", color: "#10B981" },
    { emoji: "🌐", title: "Profil en ligne", desc: "Votre carte de visite numérique", color: "#F59E0B" },
    { emoji: "📈", title: "SEO optimisé", desc: "Visibilité maximale sur Google", color: "#8B5CF6" },
    { emoji: "🔒", title: "Sécurisé", desc: "Données protégées et chiffrées", color: "#EC4899" },
  ];

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        opacity: titleOpacity, display: "flex", alignItems: "center", gap: 15, marginBottom: 35,
      }}>
        <span style={{ fontSize: 50 }}>✨</span>
        <h2 style={{ fontSize: 42, fontWeight: 700, color: "white", margin: 0 }}>
          Et bien plus encore...
        </h2>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, width: 900, justifyContent: "center" }}>
        {features.map((feat, i) => {
          const delay = 8 + i * 8;
          const s = spring({ frame: frame - delay, fps, config: { damping: 12 } });
          const o = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              opacity: o, transform: `scale(${s})`,
              width: 280, background: "rgba(255,255,255,0.06)",
              borderRadius: 20, border: `1px solid ${feat.color}25`,
              padding: "24px 20px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center",
            }}>
              <span style={{ fontSize: 36 }}>{feat.emoji}</span>
              <div style={{ fontSize: 20, fontWeight: 600, color: "white" }}>{feat.title}</div>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.45)" }}>{feat.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
