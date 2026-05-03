import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const StoryStep3 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const handshakeScale = spring({ frame: frame - 5, fps, config: { damping: 8 } });
  const textOp = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const rewardScale = spring({ frame: frame - 40, fps, config: { damping: 10 } });
  const sparkle = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.8, 1.2]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        fontSize: 100, transform: `scale(${handshakeScale})`, marginBottom: 30,
      }}>
        🤝
      </div>

      <div style={{
        fontSize: 32, color: "white", fontWeight: 700,
        textAlign: "center", opacity: textOp, marginBottom: 40,
      }}>
        Amadou récupère{"\n"}son passeport !
      </div>

      <div style={{
        background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
        borderRadius: 20, padding: "20px 40px",
        transform: `scale(${rewardScale * sparkle})`,
        boxShadow: "0 10px 40px rgba(251,191,36,0.4)",
      }}>
        <div style={{ fontSize: 22, color: "#0F172A", fontWeight: 800, textAlign: "center" }}>
          💰 Le trouveur reçoit
        </div>
        <div style={{ fontSize: 40, color: "#0F172A", fontWeight: 900, textAlign: "center" }}>
          2 000 Fr
        </div>
      </div>
    </AbsoluteFill>
  );
};
