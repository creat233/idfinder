import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const ProtectIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = interpolate(spring({ frame, fps, config: { damping: 15 } }), [0, 1], [80, 0]);
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOp = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const iconScale = spring({ frame: frame - 10, fps, config: { damping: 10 } });
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [1, 1.05]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        fontSize: 120,
        transform: `scale(${iconScale * pulse})`,
        marginBottom: 40,
        filter: `drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))`,
      }}>
        🛡️
      </div>
      <div style={{
        fontSize: 52,
        fontWeight: 800,
        color: "white",
        textAlign: "center",
        lineHeight: 1.2,
        opacity: titleOp,
        transform: `translateY(${titleY}px)`,
        textShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}>
        Protégez vos{"\n"}documents
      </div>
      <div style={{
        fontSize: 28,
        color: "rgba(255,255,255,0.7)",
        marginTop: 20,
        opacity: subtitleOp,
        textAlign: "center",
        fontWeight: 500,
      }}>
        En seulement 30 secondes
      </div>
    </AbsoluteFill>
  );
};
