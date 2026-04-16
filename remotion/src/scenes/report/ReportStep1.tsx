import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const ReportStep1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepBadge = spring({ frame, fps, config: { damping: 12 } });

  const items = [
    { emoji: "📝", label: "Numéro de la carte / document" },
    { emoji: "📍", label: "Lieu où vous l'avez trouvé" },
    { emoji: "📅", label: "Date de la trouvaille" },
    { emoji: "📸", label: "Photo du document (optionnel)" },
  ];

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 60 }}>
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

      <h2 style={{
        fontSize: 52, fontWeight: 700, color: "white", textAlign: "center",
        margin: 0, marginBottom: 15,
        opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(spring({ frame: frame - 5, fps, config: { damping: 15 } }), [0, 1], [40, 0])}px)`,
      }}>
        Signalez la trouvaille
      </h2>

      <p style={{
        fontSize: 28, color: "rgba(255,255,255,0.6)", textAlign: "center",
        margin: 0, marginBottom: 40,
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Entrez les informations du document
      </p>

      {/* Mock form */}
      <div
        style={{
          width: 850,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 30,
          border: "1px solid rgba(255,255,255,0.12)",
          padding: 50,
        }}
      >
        {items.map((item, i) => {
          const delay = 15 + i * 12;
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
                padding: "22px 0",
                borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  background: "rgba(59, 130, 246, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 30 }}>{item.emoji}</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 26 }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
