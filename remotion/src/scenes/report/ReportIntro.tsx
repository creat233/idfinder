import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const ReportIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeScale = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 150 } });
  const badgeOpacity = interpolate(frame, [5, 15], [0, 1], { extrapolateRight: "clamp" });

  const titleY = interpolate(spring({ frame, fps, config: { damping: 15, stiffness: 80 } }), [0, 1], [80, 0]);
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const subtitleY = interpolate(spring({ frame: frame - 15, fps, config: { damping: 15 } }), [0, 1], [60, 0]);
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });

  const iconPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.95, 1.05]);
  const lineWidth = interpolate(frame, [30, 60], [0, 400], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 80 }}>
      {/* Badge */}
      <div
        style={{
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          background: "linear-gradient(135deg, #10B981, #059669)",
          borderRadius: 50,
          padding: "14px 36px",
          marginBottom: 40,
          boxShadow: "0 8px 30px rgba(16, 185, 129, 0.4)",
        }}
      >
        <span style={{ color: "white", fontSize: 28, fontWeight: 600, letterSpacing: 2 }}>
          🔍 SIGNALEMENT
        </span>
      </div>

      {/* Icon */}
      <div
        style={{
          transform: `scale(${iconPulse})`,
          width: 160,
          height: 160,
          borderRadius: 40,
          background: "linear-gradient(135deg, #10B981, #3B82F6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 50,
          boxShadow: "0 15px 50px rgba(16, 185, 129, 0.3)",
        }}
      >
        <span style={{ fontSize: 80 }}>🪪</span>
      </div>

      {/* Title */}
      <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
        <h1 style={{ fontSize: 68, fontWeight: 800, color: "white", lineHeight: 1.1, margin: 0 }}>
          Vous avez trouvé
        </h1>
        <h1
          style={{
            fontSize: 68,
            fontWeight: 800,
            background: "linear-gradient(90deg, #10B981, #3B82F6)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          un document ?
        </h1>
      </div>

      {/* Line */}
      <div
        style={{
          width: lineWidth,
          height: 4,
          background: "linear-gradient(90deg, transparent, #10B981, transparent)",
          borderRadius: 2,
          marginTop: 30,
          marginBottom: 30,
        }}
      />

      {/* Subtitle */}
      <div style={{ opacity: subtitleOpacity, transform: `translateY(${subtitleY}px)`, textAlign: "center" }}>
        <p style={{ fontSize: 36, color: "rgba(255,255,255,0.7)", margin: 0, fontWeight: 400 }}>
          Signalez-le sur Finder ID
        </p>
        <p style={{ fontSize: 32, color: "#10B981", margin: 0, marginTop: 15, fontWeight: 700 }}>
          et gagnez 2 000 Fr ! 💰
        </p>
      </div>
    </AbsoluteFill>
  );
};
