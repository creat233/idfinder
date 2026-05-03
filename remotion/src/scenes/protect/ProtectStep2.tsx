import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const ProtectStep2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = ["📸 Photo du document", "✏️ Numéro & type", "📍 Lieu de perte"];
  
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        fontSize: 22, color: "#3B82F6", fontWeight: 700, marginBottom: 10,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Étape 2
      </div>
      <div style={{
        fontSize: 36, color: "white", fontWeight: 800, textAlign: "center", marginBottom: 50,
        opacity: interpolate(frame, [5, 25], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Enregistrez vos documents
      </div>

      {items.map((item, i) => {
        const s = spring({ frame: frame - 20 - i * 12, fps, config: { damping: 12 } });
        const x = interpolate(s, [0, 1], [200, 0]);
        return (
          <div key={i} style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: 16, padding: "20px 32px",
            marginBottom: 16, width: "85%",
            border: "1px solid rgba(255,255,255,0.1)",
            transform: `translateX(${x}px)`,
            opacity: s,
            display: "flex", alignItems: "center",
          }}>
            <span style={{ fontSize: 28, color: "white", fontWeight: 600 }}>{item}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
