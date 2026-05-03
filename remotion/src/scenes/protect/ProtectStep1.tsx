import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const ProtectStep1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({ frame: frame - 5, fps, config: { damping: 12 } });
  const textOp = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });
  const textY = interpolate(spring({ frame: frame - 15, fps, config: { damping: 15 } }), [0, 1], [40, 0]);
  const float = interpolate(Math.sin(frame * 0.05), [-1, 1], [-5, 5]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        width: 320, height: 200, borderRadius: 20,
        background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
        transform: `scale(${cardScale}) translateY(${float}px)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 20px 60px rgba(59,130,246,0.4)",
        marginBottom: 50,
      }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: 50, marginBottom: 10 }}>🪪</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>CNI • Passeport</div>
          <div style={{ fontSize: 14, opacity: 0.7, marginTop: 5 }}>Permis • Diplôme</div>
        </div>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "24px 36px",
        border: "1px solid rgba(255,255,255,0.1)",
        opacity: textOp,
        transform: `translateY(${textY}px)`,
      }}>
        <div style={{ fontSize: 22, color: "#3B82F6", fontWeight: 700, marginBottom: 8 }}>
          Étape 1
        </div>
        <div style={{ fontSize: 30, color: "white", fontWeight: 700 }}>
          Créez votre compte gratuit
        </div>
        <div style={{ fontSize: 20, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>
          sur www.finderid.info
        </div>
      </div>
    </AbsoluteFill>
  );
};
