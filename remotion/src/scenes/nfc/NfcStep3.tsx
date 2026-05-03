import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const NfcStep3 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { icon: "🔗", text: "QR Code unique" },
    { icon: "📊", text: "Statistiques de vues" },
    { icon: "🎨", text: "Design personnalisé" },
  ];

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        fontSize: 32, color: "white", fontWeight: 800,
        textAlign: "center", marginBottom: 40, opacity: titleOp,
      }}>
        + Fonctionnalités pro
      </div>

      {features.map((f, i) => {
        const s = spring({ frame: frame - 15 - i * 12, fps, config: { damping: 10 } });
        const y = interpolate(s, [0, 1], [60, 0]);
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 20,
            background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.15))",
            borderRadius: 20, padding: "22px 32px",
            marginBottom: 16, width: "85%",
            border: "1px solid rgba(168,85,247,0.2)",
            transform: `translateY(${y}px)`, opacity: s,
          }}>
            <span style={{ fontSize: 40 }}>{f.icon}</span>
            <span style={{ fontSize: 26, color: "white", fontWeight: 600 }}>{f.text}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
