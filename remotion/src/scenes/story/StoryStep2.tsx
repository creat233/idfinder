import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const StoryStep2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneScale = spring({ frame: frame - 5, fps, config: { damping: 12 } });
  const notifY = interpolate(spring({ frame: frame - 30, fps, config: { damping: 10 } }), [0, 1], [-80, 0]);
  const notifOp = interpolate(frame, [28, 40], [0, 1], { extrapolateRight: "clamp" });
  const glow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.6]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{ position: "relative", marginBottom: 50 }}>
        <div style={{
          width: 180, height: 300, borderRadius: 30,
          background: "linear-gradient(180deg, #1E293B, #0F172A)",
          border: "2px solid rgba(255,255,255,0.15)",
          transform: `scale(${phoneScale})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 40px rgba(34,197,94,${glow})`,
        }}>
          <span style={{ fontSize: 60 }}>🔔</span>
        </div>

        <div style={{
          position: "absolute", top: -20, right: -100,
          background: "linear-gradient(135deg, #22C55E, #16A34A)",
          borderRadius: 16, padding: "14px 22px",
          transform: `translateY(${notifY}px)`, opacity: notifOp,
          boxShadow: "0 8px 30px rgba(34,197,94,0.4)",
        }}>
          <span style={{ fontSize: 18, color: "white", fontWeight: 700 }}>
            🎉 Document trouvé !
          </span>
        </div>
      </div>

      <div style={{
        fontSize: 30, color: "white", fontWeight: 700,
        textAlign: "center",
        opacity: interpolate(frame, [35, 55], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Quelqu'un a signalé{"\n"}son passeport sur{"\n"}Finder ID !
      </div>
    </AbsoluteFill>
  );
};
