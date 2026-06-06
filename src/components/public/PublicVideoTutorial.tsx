import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";

const videos = [
  {
    src: "/videos/mcard-boutique-tutoriel.mp4",
    badge: "🛍️ Boutique",
    title: "Créez votre boutique en ligne",
    description: "Découvrez comment lancer votre MCard et vendre vos produits",
  },
  {
    src: "/videos/finder-id-signalement.mp4",
    badge: "🔍 Signalement",
    title: "Signalez un document trouvé",
    description: "Gagnez 2 000 Fr en signalant un document trouvé",
  },
  {
    src: "/videos/finder-id-fonctionnalites.mp4",
    badge: "🚀 Fonctionnalités",
    title: "Découvrez Finder ID",
    description: "Toutes les fonctionnalités en un coup d'œil",
  },
  {
    src: "/videos/finder-id-protection.mp4",
    badge: "🛡️ Protection",
    title: "Protégez vos documents",
    description: "Enregistrez vos documents en 30 secondes",
  },
  {
    src: "/videos/finder-id-nfc-mcard.mp4",
    badge: "💼 NFC",
    title: "Carte de visite digitale NFC",
    description: "Partagez vos contacts d'un simple geste",
  },
  {
    src: "/videos/finder-id-temoignage.mp4",
    badge: "🏆 Témoignage",
    title: "J'ai retrouvé mon passeport",
    description: "L'histoire d'Amadou et la communauté solidaire",
  },
];

export const PublicVideoTutorial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      // iOS Safari: ensure muted state matches to satisfy autoplay policy if needed
      if (!v.muted && isMuted) v.muted = true;
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // Fallback: force mute and retry (Safari requires muted for programmatic play without gesture chain)
          v.muted = true;
          setIsMuted(true);
          v.play().catch(() => {});
        });
      }
    } else {
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    v.muted = next;
    setIsMuted(next);
    // If unmuting while paused, kick playback within the gesture
    if (!next && v.paused) {
      v.play().catch(() => {});
    }
  };

  const switchVideo = (index: number) => {
    const v = videoRef.current;
    if (v) {
      v.pause();
    }
    setIsPlaying(false);
    setActiveIndex(index);
  };

  const prev = () => switchVideo(activeIndex === 0 ? videos.length - 1 : activeIndex - 1);
  const next = () => switchVideo(activeIndex === videos.length - 1 ? 0 : activeIndex + 1);

  const current = videos[activeIndex];

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/15 backdrop-blur-md"
            style={{ background: 'hsl(var(--vapor-cyan) / 0.12)', color: 'hsl(var(--vapor-cyan))' }}>
            🎬 Tutoriels vidéo
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Découvrez Finder ID en vidéo
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Apprenez à utiliser toutes les fonctionnalités de l'application
          </p>
        </motion.div>

        {/* Video selector tabs */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {videos.map((video, i) => (
            <button
              key={i}
              onClick={() => switchVideo(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === activeIndex
                  ? "text-slate-900 shadow-md"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
              }`}
              style={i === activeIndex ? { background: 'linear-gradient(135deg, hsl(var(--vapor-mist)), hsl(var(--vapor-lavender)))' } : {}}
            >
              {video.badge}
            </button>
          ))}
        </div>

        {/* Current video info */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-4"
        >
          <h3 className="font-display text-lg font-semibold text-white">{current.title}</h3>
          <p className="text-sm text-slate-400">{current.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl bg-black w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto"
        >
          <video
            ref={videoRef}
            key={current.src}
            src={current.src}
            className="w-full h-auto aspect-[9/16] object-contain bg-black"
            muted={isMuted}
            playsInline
            // @ts-ignore - iOS Safari legacy attribute
            webkit-playsinline="true"
            preload="metadata"
            controls={false}
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Play overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity cursor-pointer"
            onClick={togglePlay}
            style={{ opacity: isPlaying ? 0 : 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="w-7 h-7 text-primary ml-1" />
            </div>
          </div>

          {/* Nav arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom controls */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {videos.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeIndex ? "bg-white w-6" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
