import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const SceneIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = interpolate(spring({ frame, fps, config: { damping: 15, stiffness: 80 } }), [0, 1], [80, 0]);
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const subtitleY = interpolate(spring({ frame: frame - 15, fps, config: { damping: 15 } }), [0, 1], [60, 0]);
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });

  const badgeScale = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 150 } });
  const badgeOpacity = interpolate(frame, [5, 15], [0, 1], { extrapolateRight: "clamp" });

  const iconPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.95, 1.05]);

  // Decorative line
  const lineWidth = interpolate(frame, [30, 60], [0, 400], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 80 }}>
      {/* Badge */}
      <div
        style={{
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          background: "linear-gradient(135deg, #8B5CF6, #6366F1)",
          borderRadius: 50,
          padding: "14px 36px",
          marginBottom: 40,
          boxShadow: "0 8px 30px rgba(139, 92, 246, 0.4)",
        }}
      >
        <span style={{ color: "white", fontSize: 28, fontWeight: 600, letterSpacing: 2 }}>
          📱 TUTORIEL
        </span>
      </div>

      {/* Icon */}
      <div
        style={{
          transform: `scale(${iconPulse})`,
          width: 160,
          height: 160,
          borderRadius: 40,
          background: "linear-gradient(135deg, #F59E0B, #EF4444)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 50,
          boxShadow: "0 15px 50px rgba(245, 158, 11, 0.3)",
        }}
      >
        <span style={{ fontSize: 80 }}>🛍️</span>
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Créez votre
        </h1>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            background: "linear-gradient(90deg, #F59E0B, #EF4444)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Boutique en ligne
        </h1>
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: lineWidth,
          height: 4,
          background: "linear-gradient(90deg, transparent, #8B5CF6, transparent)",
          borderRadius: 2,
          marginTop: 30,
          marginBottom: 30,
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 36, color: "rgba(255,255,255,0.7)", margin: 0, fontWeight: 400 }}>
          avec MCard sur Finder ID
        </p>
        <p style={{ fontSize: 28, color: "rgba(255,255,255,0.5)", margin: 0, marginTop: 10 }}>
          En 3 étapes simples
        </p>
      </div>
    </AbsoluteFill>
  );
};
