import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const FeaturesIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeScale = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 150 } });
  const badgeOpacity = interpolate(frame, [5, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(spring({ frame, fps, config: { damping: 15, stiffness: 80 } }), [0, 1], [80, 0]);
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });
  const subtitleY = interpolate(spring({ frame: frame - 15, fps, config: { damping: 15 } }), [0, 1], [60, 0]);
  const iconPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.95, 1.05]);
  const lineWidth = interpolate(frame, [30, 60], [0, 400], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div style={{
        opacity: badgeOpacity, transform: `scale(${badgeScale})`,
        background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
        borderRadius: 50, padding: "14px 36px", marginBottom: 40,
        boxShadow: "0 8px 30px rgba(139, 92, 246, 0.4)",
      }}>
        <span style={{ color: "white", fontSize: 28, fontWeight: 600, letterSpacing: 2 }}>
          🚀 DÉCOUVREZ
        </span>
      </div>

      <div style={{
        transform: `scale(${iconPulse})`, width: 160, height: 160, borderRadius: 40,
        background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 50, boxShadow: "0 15px 50px rgba(139, 92, 246, 0.3)",
      }}>
        <span style={{ fontSize: 80, color: "white", fontWeight: 800 }}>F</span>
      </div>

      <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
        <h1 style={{ fontSize: 72, fontWeight: 800, color: "white", lineHeight: 1.1, margin: 0 }}>
          Finder ID
        </h1>
        <h1 style={{
          fontSize: 52, fontWeight: 700,
          background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
          backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1.2, margin: 0, marginTop: 10,
        }}>
          Tout-en-un
        </h1>
      </div>

      <div style={{
        width: lineWidth, height: 4,
        background: "linear-gradient(90deg, transparent, #8B5CF6, transparent)",
        borderRadius: 2, marginTop: 30, marginBottom: 30,
      }} />

      <div style={{ opacity: subtitleOpacity, transform: `translateY(${subtitleY}px)`, textAlign: "center" }}>
        <p style={{ fontSize: 32, color: "rgba(255,255,255,0.7)", margin: 0, fontWeight: 400 }}>
          L'application qui protège vos documents
        </p>
        <p style={{ fontSize: 28, color: "rgba(255,255,255,0.5)", margin: 0, marginTop: 10 }}>
          et booste votre business
        </p>
      </div>
    </AbsoluteFill>
  );
};
