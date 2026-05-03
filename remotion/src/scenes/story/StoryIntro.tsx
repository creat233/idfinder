import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const StoryIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(spring({ frame, fps, config: { damping: 15 } }), [0, 1], [60, 0]);
  const quoteOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        fontSize: 80, marginBottom: 30,
        transform: `scale(${spring({ frame: frame - 5, fps, config: { damping: 8 } })})`,
      }}>
        🏆
      </div>
      <div style={{
        fontSize: 42, fontWeight: 800, color: "white",
        textAlign: "center", lineHeight: 1.3,
        opacity: titleOp, transform: `translateY(${titleY}px)`,
      }}>
        Témoignage
      </div>
      <div style={{
        fontSize: 26, color: "#FBBF24", fontWeight: 600,
        textAlign: "center", marginTop: 20, opacity: quoteOp,
        fontStyle: "italic",
      }}>
        "J'ai retrouvé mon{"\n"}passeport grâce{"\n"}à Finder ID"
      </div>
    </AbsoluteFill>
  );
};
