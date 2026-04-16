import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const ReportStep2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepBadge = spring({ frame, fps, config: { damping: 12 } });

  const notifY = interpolate(spring({ frame: frame - 20, fps, config: { damping: 12 } }), [0, 1], [80, 0]);
  const notifOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" });

  const bellShake = interpolate(Math.sin(frame * 0.15), [-1, 1], [-8, 8]);

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div
        style={{
          transform: `scale(${stepBadge})`,
          width: 100, height: 100, borderRadius: "50%",
          background: "linear-gradient(135deg, #10B981, #059669)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 30,
          boxShadow: "0 10px 40px rgba(16, 185, 129, 0.4)",
        }}
      >
        <span style={{ color: "white", fontSize: 48, fontWeight: 800 }}>2</span>
      </div>

      <h2 style={{
        fontSize: 52, fontWeight: 700, color: "white", textAlign: "center",
        margin: 0, marginBottom: 15,
        opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(spring({ frame: frame - 5, fps, config: { damping: 15 } }), [0, 1], [40, 0])}px)`,
      }}>
        Le propriétaire est alerté
      </h2>

      <p style={{
        fontSize: 28, color: "rgba(255,255,255,0.6)", textAlign: "center",
        margin: 0, marginBottom: 50,
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Notification instantanée
      </p>

      {/* Notification bell */}
      <div style={{ transform: `rotate(${bellShake}deg)`, fontSize: 100, marginBottom: 40 }}>
        🔔
      </div>

      {/* Mock notifications */}
      {[
        { icon: "📧", text: "Email envoyé au propriétaire", color: "#3B82F6" },
        { icon: "💬", text: "WhatsApp de notification", color: "#25D366" },
        { icon: "🔔", text: "Notification push envoyée", color: "#F59E0B" },
      ].map((notif, i) => {
        const delay = 25 + i * 15;
        const s = spring({ frame: frame - delay, fps, config: { damping: 12 } });
        const o = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp" });
        
        return (
          <div
            key={i}
            style={{
              opacity: o,
              transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
              width: 800,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 20,
              border: `1px solid ${notif.color}30`,
              padding: "25px 35px",
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 15,
            }}
          >
            <span style={{ fontSize: 40 }}>{notif.icon}</span>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 26, fontWeight: 500 }}>{notif.text}</span>
            <span style={{ marginLeft: "auto", color: notif.color, fontSize: 22, fontWeight: 600 }}>✓ Envoyé</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
