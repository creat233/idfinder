import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const SceneStep3 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepBadge = spring({ frame, fps, config: { damping: 12 } });

  const features = [
    { emoji: "📊", label: "Analytics en temps réel" },
    { emoji: "💰", label: "Suivi des revenus" },
    { emoji: "📦", label: "Gestion des stocks" },
    { emoji: "📋", label: "Factures automatiques" },
  ];

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* Step badge */}
      <div
        style={{
          transform: `scale(${stepBadge})`,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #F59E0B, #EF4444)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 30,
          boxShadow: "0 10px 40px rgba(245, 158, 11, 0.4)",
        }}
      >
        <span style={{ color: "white", fontSize: 48, fontWeight: 800 }}>3</span>
      </div>

      <h2 style={{
        fontSize: 52,
        fontWeight: 700,
        color: "white",
        textAlign: "center",
        margin: 0,
        marginBottom: 15,
        opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(spring({ frame: frame - 5, fps, config: { damping: 15 } }), [0, 1], [40, 0])}px)`,
      }}>
        Gérez votre business
      </h2>

      <p style={{
        fontSize: 28,
        color: "rgba(255,255,255,0.6)",
        textAlign: "center",
        margin: 0,
        marginBottom: 40,
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Tout depuis votre tableau de bord
      </p>

      {/* Feature grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, width: 850, justifyContent: "center" }}>
        {features.map((feat, i) => {
          const delay = 15 + i * 12;
          const s = spring({ frame: frame - delay, fps, config: { damping: 10 } });
          const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
          const floatY = interpolate(Math.sin(frame * 0.04 + i * 1.5), [-1, 1], [-4, 4]);

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `scale(${s}) translateY(${floatY}px)`,
                width: 390,
                background: "rgba(255,255,255,0.07)",
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "35px 30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 15,
              }}
            >
              <span style={{ fontSize: 50 }}>{feat.emoji}</span>
              <span style={{ fontSize: 24, fontWeight: 600, color: "white", textAlign: "center" }}>{feat.label}</span>
            </div>
          );
        })}
      </div>

      {/* Stats bar */}
      <div
        style={{
          marginTop: 40,
          opacity: interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" }),
          display: "flex",
          gap: 50,
        }}
      >
        {[
          { value: "+40%", label: "Visibilité" },
          { value: "24/7", label: "Disponible" },
          { value: "3000", label: "FCFA/mois" },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#F59E0B" }}>{stat.value}</div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)" }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
