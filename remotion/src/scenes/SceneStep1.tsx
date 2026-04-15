import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const SceneStep1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepBadge = spring({ frame, fps, config: { damping: 12 } });
  const cardSlide = spring({ frame: frame - 10, fps, config: { damping: 18 } });
  const cardOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });

  const items = ["Nom complet", "Profession", "Photo de profil", "Réseaux sociaux"];

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* Step badge */}
      <div
        style={{
          transform: `scale(${stepBadge})`,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #3B82F6, #6366F1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 30,
          boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4)",
        }}
      >
        <span style={{ color: "white", fontSize: 48, fontWeight: 800 }}>1</span>
      </div>

      {/* Title */}
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
        Créez votre MCard
      </h2>

      <p style={{
        fontSize: 28,
        color: "rgba(255,255,255,0.6)",
        textAlign: "center",
        margin: 0,
        marginBottom: 40,
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Remplissez vos informations
      </p>

      {/* Mock card */}
      <div
        style={{
          opacity: cardOpacity,
          transform: `translateY(${interpolate(cardSlide, [0, 1], [60, 0])}px)`,
          width: 850,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 30,
          border: "1px solid rgba(255,255,255,0.12)",
          padding: 50,
        }}
      >
        {/* Mock profile header */}
        <div style={{ display: "flex", alignItems: "center", gap: 30, marginBottom: 40 }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F59E0B, #EF4444)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 50 }}>👤</span>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "white" }}>Votre Nom</div>
            <div style={{ fontSize: 22, color: "rgba(255,255,255,0.5)" }}>Votre Profession</div>
          </div>
        </div>

        {/* Form fields */}
        {items.map((item, i) => {
          const delay = 20 + i * 12;
          const itemSpring = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const itemOpacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                transform: `translateX(${interpolate(itemSpring, [0, 1], [40, 0])}px)`,
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "18px 0",
                borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(59, 130, 246, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "#60A5FA", fontSize: 18 }}>✓</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 26 }}>{item}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
