import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const StoryStep1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const emojiScale = spring({ frame: frame - 10, fps, config: { damping: 10 } });
  const cardY = interpolate(spring({ frame: frame - 20, fps, config: { damping: 12 } }), [0, 1], [80, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{ fontSize: 80, transform: `scale(${emojiScale})`, marginBottom: 30 }}>
        😰
      </div>
      <div style={{
        fontSize: 32, color: "white", fontWeight: 700,
        textAlign: "center", opacity: textOp, marginBottom: 40,
      }}>
        Amadou a perdu son{"\n"}passeport au marché
      </div>

      <div style={{
        background: "rgba(239,68,68,0.15)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: 20, padding: "24px 36px",
        transform: `translateY(${cardY}px)`,
        opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{ fontSize: 24, color: "#EF4444", fontWeight: 700, marginBottom: 8 }}>
          😱 Situation critique
        </div>
        <div style={{ fontSize: 20, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
          Vol à destination prévu{"\n"}dans 3 jours...
        </div>
      </div>
    </AbsoluteFill>
  );
};
