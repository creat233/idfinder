import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const NfcStep1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { icon: "👤", text: "Nom, photo, bio" },
    { icon: "📞", text: "Téléphone, email" },
    { icon: "🌐", text: "Site web, réseaux" },
    { icon: "🛍️", text: "Boutique en ligne" },
  ];

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        fontSize: 34, color: "white", fontWeight: 800,
        textAlign: "center", marginBottom: 40, opacity: titleOp,
      }}>
        Créez votre MCard
      </div>

      <div style={{ width: "90%" }}>
        {items.map((item, i) => {
          const s = spring({ frame: frame - 10 - i * 10, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 20,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 16, padding: "18px 28px",
              marginBottom: 14,
              border: "1px solid rgba(255,255,255,0.1)",
              transform: `scale(${s})`, opacity: s,
            }}>
              <span style={{ fontSize: 36 }}>{item.icon}</span>
              <span style={{ fontSize: 24, color: "white", fontWeight: 600 }}>{item.text}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
