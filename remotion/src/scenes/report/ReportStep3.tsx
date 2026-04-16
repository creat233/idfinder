import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const ReportStep3 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stepBadge = spring({ frame, fps, config: { damping: 12 } });

  const handshakeScale = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.95, 1.05]);

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div
        style={{
          transform: `scale(${stepBadge})`,
          width: 100, height: 100, borderRadius: "50%",
          background: "linear-gradient(135deg, #F59E0B, #EF4444)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 30,
          boxShadow: "0 10px 40px rgba(245, 158, 11, 0.4)",
        }}
      >
        <span style={{ color: "white", fontSize: 48, fontWeight: 800 }}>3</span>
      </div>

      <h2 style={{
        fontSize: 52, fontWeight: 700, color: "white", textAlign: "center",
        margin: 0, marginBottom: 15,
        opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(spring({ frame: frame - 5, fps, config: { damping: 15 } }), [0, 1], [40, 0])}px)`,
      }}>
        Rendez le document
      </h2>

      <p style={{
        fontSize: 28, color: "rgba(255,255,255,0.6)", textAlign: "center",
        margin: 0, marginBottom: 40,
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        et recevez votre récompense
      </p>

      {/* Handshake icon */}
      <div style={{ transform: `scale(${handshakeScale})`, fontSize: 120, marginBottom: 40 }}>
        🤝
      </div>

      {/* Reward card */}
      <div
        style={{
          opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${spring({ frame: frame - 30, fps, config: { damping: 10 } })})`,
          width: 800,
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(245, 158, 11, 0.15))",
          borderRadius: 30,
          border: "2px solid rgba(16, 185, 129, 0.3)",
          padding: 50,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 30, color: "rgba(255,255,255,0.7)", margin: 0, marginBottom: 15 }}>
          Votre récompense
        </p>
        <div style={{
          fontSize: 80, fontWeight: 800,
          background: "linear-gradient(90deg, #10B981, #F59E0B)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: 0,
        }}>
          2 000 Fr
        </div>
        <p style={{ fontSize: 26, color: "rgba(255,255,255,0.5)", margin: 0, marginTop: 15 }}>
          Pour votre honnêteté 🎉
        </p>
      </div>

      {/* Trust badge */}
      <div
        style={{
          opacity: interpolate(frame, [55, 70], [0, 1], { extrapolateRight: "clamp" }),
          marginTop: 30,
          display: "flex",
          gap: 30,
        }}
      >
        {[
          { icon: "🔒", text: "Sécurisé" },
          { icon: "⚡", text: "Rapide" },
          { icon: "✅", text: "Garanti" },
        ].map((badge, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>{badge.icon}</div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", marginTop: 5 }}>{badge.text}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
