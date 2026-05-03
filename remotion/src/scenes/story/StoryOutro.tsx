import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const StoryOutro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const urlOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.95, 1.05]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        fontSize: 44, fontWeight: 900, color: "white", textAlign: "center",
        transform: `scale(${titleScale})`, marginBottom: 20,
      }}>
        Rejoignez la{"\n"}communauté solidaire
      </div>
      <div style={{
        fontSize: 22, color: "rgba(255,255,255,0.6)",
        textAlign: "center", marginBottom: 40, opacity: urlOp,
      }}>
        Protégez vos documents.{"\n"}Aidez les autres. Gagnez des récompenses.
      </div>
      <div style={{
        background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
        borderRadius: 20, padding: "20px 50px",
        opacity: urlOp, transform: `scale(${pulse})`,
        boxShadow: "0 10px 40px rgba(251,191,36,0.4)",
      }}>
        <span style={{ fontSize: 28, color: "#0F172A", fontWeight: 800 }}>
          www.finderid.info
        </span>
      </div>
    </AbsoluteFill>
  );
};
