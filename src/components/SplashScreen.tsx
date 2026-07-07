import { useEffect, useState } from "react";

const SESSION_KEY = "finderid_splash_shown";

export const SplashScreen = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) !== "1";
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const fadeTimer = setTimeout(() => setFading(true), 2400);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

  const faceBase =
    "absolute inset-0 rounded-2xl flex items-center justify-center font-black text-4xl tracking-tight text-slate-900 shadow-[0_20px_60px_-10px_rgba(99,102,241,0.6)] border border-white/40";
  const faceBg = {
    background:
      "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 40%, #f5d0fe 100%)",
  };
  const size = 128; // px cube edge
  const half = size / 2;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(circle at 30% 20%, #4f46e5 0%, #1e1b4b 45%, #0a0a1a 100%)",
      }}
    >
      {/* Animated blobs */}
      <div
        className="absolute -top-32 -left-32 w-[55%] h-[55%] rounded-full blur-[120px] opacity-50 animate-splash-pulse"
        style={{ background: "#6366f1" }}
      />
      <div
        className="absolute -bottom-40 -right-32 w-[60%] h-[60%] rounded-full blur-[150px] opacity-40 animate-splash-pulse"
        style={{ background: "#ec4899", animationDelay: "0.4s" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-[35%] h-[40%] rounded-full blur-[110px] opacity-35 animate-splash-pulse"
        style={{ background: "#06b6d4", animationDelay: "0.8s" }}
      />

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-8 animate-splash-rise">
        {/* 3D rotating cube */}
        <div className="splash-3d-scene" style={{ width: size, height: size }}>
          <div className="splash-glow-ring" />
          <div className="splash-cube">
            <div className={faceBase} style={{ ...faceBg, transform: `translateZ(${half}px)` }}>FID</div>
            <div className={faceBase} style={{ ...faceBg, transform: `rotateY(180deg) translateZ(${half}px)` }}>FID</div>
            <div className={faceBase} style={{ ...faceBg, transform: `rotateY(90deg) translateZ(${half}px)` }}>FID</div>
            <div className={faceBase} style={{ ...faceBg, transform: `rotateY(-90deg) translateZ(${half}px)` }}>FID</div>
            <div className={faceBase} style={{ ...faceBg, transform: `rotateX(90deg) translateZ(${half}px)` }}>FID</div>
            <div className={faceBase} style={{ ...faceBg, transform: `rotateX(-90deg) translateZ(${half}px)` }}>FID</div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Finder{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c7d2fe, #f0abfc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ID
            </span>
          </h1>
          <p className="text-sm text-white/60 tracking-widest uppercase">
            Connecting the world
          </p>
        </div>

        <div className="w-40 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full animate-splash-loader"
            style={{
              background: "linear-gradient(90deg, #6366f1, #ec4899, #06b6d4)",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes splash-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.6; }
        }
        @keyframes splash-rise {
          0% { transform: translateY(20px) scale(0.92); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes splash-loader {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes splash-cube-spin {
          0%   { transform: rotateX(-20deg) rotateY(0deg); }
          100% { transform: rotateX(-20deg) rotateY(360deg); }
        }
        @keyframes splash-ring {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.25); opacity: 0.9; }
        }
        .animate-splash-pulse { animation: splash-pulse 3.5s ease-in-out infinite; }
        .animate-splash-rise { animation: splash-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .animate-splash-loader { animation: splash-loader 2.4s ease-out forwards; }

        .splash-3d-scene {
          position: relative;
          perspective: 900px;
        }
        .splash-cube {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: splash-cube-spin 3.2s linear infinite;
        }
        .splash-glow-ring {
          position: absolute;
          inset: -30px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(165,180,252,0.55), rgba(240,171,252,0.15) 55%, transparent 70%);
          filter: blur(18px);
          animation: splash-ring 2.4s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};
