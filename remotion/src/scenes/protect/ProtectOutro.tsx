import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const ProtectOutro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const urlOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.95, 1.05]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        fontSize: 48, fontWeight: 900, color: "white", textAlign: "center",
        transform: `scale(${titleScale})`, marginBottom: 30,
        textShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}>
        Ne perdez plus{"\n"}jamais vos documents
      </div>

      <div style={{
        fontSize: 24, color: "rgba(255,255,255,0.6)", textAlign: "center",
        opacity: urlOp, marginBottom: 40,
      }}>
        Inscription gratuite
      </div>

      <div style={{
        background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
        borderRadius: 20, padding: "20px 50px",
        opacity: urlOp, transform: `scale(${pulse})`,
        boxShadow: "0 10px 40px rgba(59,130,246,0.4)",
      }}>
        <span style={{ fontSize: 28, color: "white", fontWeight: 800 }}>
          www.finderid.info
        </span>
      </div>
    </AbsoluteFill>
  );
};
