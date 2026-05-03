import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const ProtectStep3 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const checkScale = spring({ frame: frame - 10, fps, config: { damping: 8 } });
  const textOp = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });
  const glow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.3, 0.7]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        width: 140, height: 140, borderRadius: "50%",
        background: `rgba(34, 197, 94, ${glow})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${checkScale})`,
        boxShadow: `0 0 60px rgba(34, 197, 94, ${glow * 0.5})`,
        marginBottom: 50,
      }}>
        <span style={{ fontSize: 70 }}>✅</span>
      </div>

      <div style={{
        fontSize: 34, color: "white", fontWeight: 800, textAlign: "center",
        opacity: textOp, marginBottom: 20,
      }}>
        Quelqu'un retrouve{"\n"}votre document ?
      </div>

      <div style={{
        fontSize: 26, color: "rgba(255,255,255,0.7)", textAlign: "center",
        opacity: textOp, lineHeight: 1.5,
      }}>
        Il scanne le QR code{"\n"}et vous êtes contacté{"\n"}instantanément ! 📲
      </div>
    </AbsoluteFill>
  );
};
