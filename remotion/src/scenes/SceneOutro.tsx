import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const SceneOutro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12 } });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const btnSpring = spring({ frame: frame - 25, fps, config: { damping: 8 } });
  const btnOpacity = interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" });

  const pulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [1, 1.05]);

  const sparkle1 = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 1]);
  const sparkle2 = interpolate(Math.sin(frame * 0.08 + 2), [-1, 1], [0.3, 1]);

  return (
    <AbsoluteFill style={{ fontFamily, justifyContent: "center", alignItems: "center", padding: 80 }}>
      {/* Sparkles */}
      <div style={{ position: "absolute", top: "15%", left: "15%", fontSize: 60, opacity: sparkle1 }}>✨</div>
      <div style={{ position: "absolute", top: "20%", right: "18%", fontSize: 45, opacity: sparkle2 }}>⭐</div>
      <div style={{ position: "absolute", bottom: "25%", left: "20%", fontSize: 50, opacity: sparkle2 }}>🌟</div>
      <div style={{ position: "absolute", bottom: "20%", right: "15%", fontSize: 55, opacity: sparkle1 }}>💫</div>

      {/* Logo / Brand */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleSpring})`,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 35,
            background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 60px rgba(139, 92, 246, 0.4)",
            margin: "0 auto 30px",
          }}
        >
          <span style={{ fontSize: 70, color: "white", fontWeight: 800 }}>F</span>
        </div>
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: 60,
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          margin: 0,
          opacity: titleOpacity,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [50, 0])}px)`,
        }}
      >
        Lancez votre
      </h2>
      <h2
        style={{
          fontSize: 60,
          fontWeight: 800,
          textAlign: "center",
          margin: 0,
          background: "linear-gradient(90deg, #F59E0B, #EF4444, #EC4899)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(spring({ frame: frame - 8, fps, config: { damping: 15 } }), [0, 1], [50, 0])}px)`,
        }}
      >
        boutique aujourd'hui !
      </h2>

      {/* Separator */}
      <div
        style={{
          width: interpolate(frame, [20, 50], [0, 300], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          height: 3,
          background: "linear-gradient(90deg, transparent, #8B5CF6, transparent)",
          borderRadius: 2,
          marginTop: 35,
          marginBottom: 35,
        }}
      />

      {/* Subtitle */}
      <p
        style={{
          fontSize: 30,
          color: "rgba(255,255,255,0.6)",
          textAlign: "center",
          margin: 0,
          marginBottom: 50,
          opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Rejoignez 5000+ professionnels sur Finder ID
      </p>

      {/* CTA Button */}
      <div
        style={{
          opacity: btnOpacity,
          transform: `scale(${interpolate(btnSpring, [0, 1], [0.5, 1]) * pulse})`,
          background: "linear-gradient(135deg, #F59E0B, #EF4444)",
          borderRadius: 30,
          padding: "24px 70px",
          boxShadow: "0 15px 50px rgba(245, 158, 11, 0.4)",
        }}
      >
        <span style={{ color: "white", fontSize: 32, fontWeight: 700 }}>
          Créer ma MCard 🚀
        </span>
      </div>

      {/* Price */}
      <p
        style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.4)",
          marginTop: 25,
          opacity: interpolate(frame, [35, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        À partir de 3 000 FCFA/mois
      </p>

      {/* Domain */}
      <p
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.5)",
          fontWeight: 600,
          marginTop: 40,
          opacity: interpolate(frame, [45, 60], [0, 1], { extrapolateRight: "clamp" }),
          letterSpacing: 1,
        }}
      >
        www.finderid.info
      </p>
    </AbsoluteFill>
  );
};
