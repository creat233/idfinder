import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

/**
 * Premium polish layer placed on top of every video.
 * - Vignette
 * - Subtle film grain
 * - Top progress bar
 * - Brand watermark (bottom)
 * - Letterbox-style intro/outro bars
 */
export const PremiumOverlay: React.FC<{ accent?: string }> = ({ accent = "#A855F7" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });

  // Letterbox bars at start/end
  const barIn = spring({ frame, fps, config: { damping: 18 } });
  const barOut = spring({ frame: durationInFrames - frame - 30, fps, config: { damping: 18 } });
  const barOpacity = Math.min(barIn, barOut, 1);

  // Watermark fades in early, stays
  const wmOp = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });

  // Animated noise offset for grain
  const grainSeed = Math.floor(frame / 2) % 8;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.35) 85%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Film grain */}
      <AbsoluteFill
        style={{
          opacity: 0.07,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${0.85 + grainSeed * 0.02}' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>")`,
          backgroundSize: "300px 300px",
        }}
      />

      {/* Top progress bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: "rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${accent}, #fff)`,
            boxShadow: `0 0 20px ${accent}aa`,
          }}
        />
      </div>

      {/* Letterbox bars (cinematic) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "linear-gradient(180deg, rgba(0,0,0,0.85), transparent)",
          opacity: barOpacity * 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(0deg, rgba(0,0,0,0.85), transparent)",
          opacity: barOpacity * 0.9,
        }}
      />

      {/* Brand watermark bottom-center */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: wmOp * 0.85,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 22px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: `linear-gradient(135deg, ${accent}, #fff)`,
            boxShadow: `0 0 12px ${accent}cc`,
          }}
        />
        <span
          style={{
            color: "rgba(255,255,255,0.95)",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 1,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          FINDER ID
        </span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, fontWeight: 500 }}>
          finderid.info
        </span>
      </div>
    </AbsoluteFill>
  );
};
