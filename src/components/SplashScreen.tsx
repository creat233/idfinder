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
    const fadeTimer = setTimeout(() => setFading(true), 1800);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 2400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

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
      <div className="relative flex flex-col items-center gap-6 animate-splash-rise">
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl blur-2xl opacity-70 animate-splash-glow"
               style={{ background: "linear-gradient(135deg, #a5b4fc, #f0abfc)" }} />
          <div
            className="relative w-24 h-24 rounded-3xl flex items-center justify-center font-bold text-3xl text-slate-900 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 50%, #f5d0fe 100%)",
            }}
          >
            <span className="tracking-tight">FID</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Finder <span style={{
              background: "linear-gradient(135deg, #c7d2fe, #f0abfc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>ID</span>
          </h1>
          <p className="text-sm text-white/60 tracking-widest uppercase">
            Connecting the world
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-40 h-1 rounded-full bg-white/10 overflow-hidden mt-2">
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
        @keyframes splash-glow {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.2); opacity: 0.85; }
        }
        @keyframes splash-loader {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-splash-pulse { animation: splash-pulse 3.5s ease-in-out infinite; }
        .animate-splash-rise { animation: splash-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .animate-splash-glow { animation: splash-glow 2.4s ease-in-out infinite; }
        .animate-splash-loader { animation: splash-loader 1.8s ease-out forwards; }
      `}</style>
    </div>
  );
};
