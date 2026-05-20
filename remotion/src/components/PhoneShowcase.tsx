import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

interface Callout {
  text: string;
  /** 0..1 vertical position inside the phone frame */
  y: number;
  /** 'left' | 'right' — which side the bubble sticks out to */
  side?: "left" | "right";
  /** delay in frames within the scene */
  delay?: number;
  emoji?: string;
}

interface Props {
  step: number;
  badgeColor?: string;
  title: string;
  subtitle?: string;
  /** path inside remotion/public/, e.g. "screenshots/home.png" */
  screenshot: string;
  callouts?: Callout[];
}

export const PhoneShowcase: React.FC<Props> = ({
  step,
  badgeColor = "#3B82F6",
  title,
  subtitle,
  screenshot,
  callouts = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeIn = spring({ frame, fps, config: { damping: 12 } });
  const titleOpacity = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(spring({ frame: frame - 5, fps, config: { damping: 16 } }), [0, 1], [40, 0]);
  const subOpacity = interpolate(frame, [12, 28], [0, 1], { extrapolateRight: "clamp" });

  // Phone enters with scale + slight rotation
  const phoneIn = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 90 } });
  const phoneScale = interpolate(phoneIn, [0, 1], [0.6, 1]);
  // gentle floating
  const float = Math.sin(frame * 0.04) * 8;
  const tilt = Math.sin(frame * 0.025) * 1.2;

  // Phone dimensions (9:19.5 iPhone-ish ratio) — fits 1080x1920 canvas
  const phoneW = 520;
  const phoneH = 1100;

  const titleBlur = interpolate(frame, [5, 25], [8, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily, alignItems: "center", padding: "60px 40px" }}>
      {/* Step badge */}
      <div
        style={{
          transform: `scale(${badgeIn})`,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${badgeColor}, ${shade(badgeColor)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 22,
          boxShadow: `0 10px 40px ${badgeColor}66, 0 0 60px ${badgeColor}55, inset 0 2px 8px rgba(255,255,255,0.3)`,
          border: "2px solid rgba(255,255,255,0.15)",
        }}
      >
        <span style={{ color: "white", fontSize: 44, fontWeight: 800, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{step}</span>
      </div>

      <h2
        style={{
          fontSize: 58,
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          margin: 0,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          letterSpacing: -1.5,
          textShadow: "0 4px 24px rgba(0,0,0,0.5)",
          filter: `blur(${titleBlur}px)`,
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.78)",
            textAlign: "center",
            margin: "14px 0 30px",
            opacity: subOpacity,
            maxWidth: 800,
            fontWeight: 500,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Phone mockup */}
      <div
        style={{
          position: "relative",
          width: phoneW,
          height: phoneH,
          transform: `translateY(${float}px) scale(${phoneScale}) rotate(${tilt}deg)`,
          opacity: phoneIn,
          marginTop: 10,
        }}
      >
        {/* Colored glow under phone */}
        <div
          style={{
            position: "absolute",
            inset: -40,
            borderRadius: 80,
            background: `radial-gradient(circle at 50% 60%, ${badgeColor}55, transparent 65%)`,
            filter: "blur(30px)",
            zIndex: -1,
          }}
        />
        {/* Phone frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 60,
            background: "linear-gradient(135deg, #2a2a32 0%, #0a0a0d 100%)",
            padding: 14,
            boxShadow:
              "0 60px 120px rgba(0,0,0,0.65), 0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.12), inset 0 2px 4px rgba(255,255,255,0.15)",
          }}
        >
          {/* Screen */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 48,
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <Img
              src={staticFile(screenshot)}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            />
            {/* Notch */}
            <div
              style={{
                position: "absolute",
                top: 14,
                left: "50%",
                transform: "translateX(-50%)",
                width: 130,
                height: 28,
                borderRadius: 20,
                background: "#000",
                zIndex: 5,
              }}
            />
            {/* Screen reflection sheen */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.05) 100%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Callouts */}
        {callouts.map((c, i) => {
          const d = (c.delay ?? 25) + i * 8;
          const cIn = spring({ frame: frame - d, fps, config: { damping: 14 } });
          const cOpacity = interpolate(frame, [d, d + 12], [0, 1], { extrapolateRight: "clamp" });
          const side = c.side ?? (i % 2 === 0 ? "right" : "left");
          const isRight = side === "right";
          const offsetX = interpolate(cIn, [0, 1], [isRight ? -30 : 30, 0]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${c.y * 100}%`,
                [isRight ? "left" : "right"]: phoneW - 60,
                transform: `translateX(${offsetX}px)`,
                opacity: cOpacity,
                display: "flex",
                alignItems: "center",
                gap: 10,
                maxWidth: 240,
                pointerEvents: "none",
              }}
            >
              {isRight && (
                <div
                  style={{
                    width: 40,
                    height: 2,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6))",
                    flexShrink: 0,
                  }}
                />
              )}
              <div
                style={{
                  background: "rgba(255,255,255,0.95)",
                  color: "#0a0a14",
                  padding: "12px 20px",
                  borderRadius: 16,
                  fontSize: 22,
                  fontWeight: 600,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {c.emoji && <span style={{ fontSize: 26 }}>{c.emoji}</span>}
                {c.text}
              </div>
              {!isRight && (
                <div
                  style={{
                    width: 60,
                    height: 2,
                    background: "linear-gradient(90deg, rgba(255,255,255,0.6), transparent)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

function shade(hex: string) {
  // simple darker variant for gradient
  const map: Record<string, string> = {
    "#3B82F6": "#6366F1",
    "#10B981": "#059669",
    "#F59E0B": "#D97706",
    "#EF4444": "#B91C1C",
    "#8B5CF6": "#6D28D9",
    "#EC4899": "#BE185D",
  };
  return map[hex] ?? "#6366F1";
}
