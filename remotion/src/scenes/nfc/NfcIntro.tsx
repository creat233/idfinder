import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const NfcIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = interpolate(spring({ frame, fps, config: { damping: 15 } }), [0, 1], [80, 0]);
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOp = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });
  const iconScale = spring({ frame: frame - 5, fps, config: { damping: 8 } });
  const wave = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.9, 1.1]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        fontSize: 120,
        transform: `scale(${iconScale * wave})`,
        marginBottom: 40,
        filter: "drop-shadow(0 0 30px rgba(168, 85, 247, 0.5))",
      }}>
        💼
      </div>
      <div style={{
        fontSize: 48, fontWeight: 800, color: "white",
        textAlign: "center", lineHeight: 1.2,
        opacity: titleOp, transform: `translateY(${titleY}px)`,
        textShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}>
        Votre carte de visite{"\n"}digitale NFC
      </div>
      <div style={{
        fontSize: 26, color: "rgba(255,255,255,0.7)",
        marginTop: 20, opacity: subtitleOp,
        textAlign: "center", fontWeight: 500,
      }}>
        Professionnelle & moderne
      </div>
    </AbsoluteFill>
  );
};
