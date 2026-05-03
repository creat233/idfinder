import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const NfcStep2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phone1X = interpolate(spring({ frame: frame - 5, fps, config: { damping: 12 } }), [0, 1], [-200, -60]);
  const phone2X = interpolate(spring({ frame: frame - 5, fps, config: { damping: 12 } }), [0, 1], [200, 60]);
  const waveOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const wavePulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.8, 1.2]);
  const textOp = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });

  const Phone = ({ x, emoji }: { x: number; emoji: string }) => (
    <div style={{
      width: 120, height: 200, borderRadius: 20,
      background: "linear-gradient(180deg, #1E293B, #0F172A)",
      border: "2px solid rgba(255,255,255,0.15)",
      display: "flex", alignItems: "center", justifyContent: "center",
      transform: `translateX(${x}px)`,
      boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
    }}>
      <span style={{ fontSize: 50 }}>{emoji}</span>
    </div>
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 50 }}>
        <Phone x={phone1X} emoji="📱" />
        <div style={{
          fontSize: 60, opacity: waveOp,
          transform: `scale(${wavePulse})`,
          margin: "0 -20px", zIndex: 10,
          filter: "drop-shadow(0 0 20px rgba(168,85,247,0.5))",
        }}>
          📡
        </div>
        <Phone x={phone2X} emoji="📲" />
      </div>

      <div style={{
        fontSize: 34, color: "white", fontWeight: 800,
        textAlign: "center", opacity: textOp, marginBottom: 15,
      }}>
        Partagez par NFC
      </div>
      <div style={{
        fontSize: 22, color: "rgba(255,255,255,0.6)",
        textAlign: "center", opacity: textOp,
      }}>
        Un simple geste suffit !
      </div>
    </AbsoluteFill>
  );
};
