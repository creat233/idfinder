import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";

const videos = [
  {
    src: "/__l5e/assets-v1/d0ddbb97-20ba-4455-b4d4-b547d5ae1eac/01-hook-cni-perdue.mp4",
    badge: "01 · CNI perdue",
    title: "CNI perdue : le réflexe Finder ID",
    description: "Une vidéo réaliste d'une minute pour comprendre comment protéger et retrouver ses documents",
  },
  {
    src: "/__l5e/assets-v1/e3b2e295-d374-4c0d-a2b8-843706cbec9e/02-temoignage-24h.mp4",
    badge: "02 · Témoignage",
    title: "Témoignage : retrouvé en 24h",
    description: "Une histoire claire qui montre comment Finder ID accélère la récupération",
  },
  {
    src: "/__l5e/assets-v1/7773e8c3-89fe-49ee-9a84-43151db45821/03-signaler-tuto.mp4",
    badge: "03 · Signaler",
    title: "Tutoriel : signaler un document",
    description: "Les bons gestes pour signaler une carte trouvée sans exposer les données sensibles",
  },
  {
    src: "/__l5e/assets-v1/3ff0bb62-1e46-47bd-a07b-c21d6bb4405f/04-nfc-mcard.mp4",
    badge: "04 · NFC",
    title: "MCard NFC : carte pro moderne",
    description: "Une carte digitale professionnelle, partageable par NFC, lien ou QR code",
  },
  {
    src: "/__l5e/assets-v1/5447f21d-e167-4be6-ba8f-773568d1dc3f/05-boutique-mcard.mp4",
    badge: "05 · Boutique",
    title: "Boutique MCard : vendre plus simplement",
    description: "Présentez produits, prix et services directement depuis votre MCard",
  },
  {
    src: "/__l5e/assets-v1/79fbd152-43aa-47e8-bfbb-b72bebacfd3e/06-geolocalisation.mp4",
    badge: "06 · Localisation",
    title: "Géolocalisation : retrouver plus vite",
    description: "Le lieu du signalement aide à organiser la récupération plus efficacement",
  },
  {
    src: "/__l5e/assets-v1/a25f99a2-665c-4008-a6d8-fea0baaa67af/07-livraison.mp4",
    badge: "07 · Livraison",
    title: "Récupération & livraison encadrée",
    description: "Une explication claire de la dernière étape : ramener le document au propriétaire",
  },
  {
    src: "/__l5e/assets-v1/c2053043-2436-41ac-8347-6cf1855f61f1/08-stats-choc.mp4",
    badge: "08 · Prévention",
    title: "Pourquoi enregistrer maintenant ?",
    description: "Une minute pour comprendre pourquoi il faut préparer ses documents avant l'urgence",
  },
  {
    src: "/__l5e/assets-v1/672424e9-0a8f-4022-ad8d-f042508d6c30/09-avant-apres.mp4",
    badge: "09 · Avant/Après",
    title: "Avant / Après Finder ID",
    description: "La différence entre une recherche désordonnée et un parcours structuré",
  },
  {
    src: "/__l5e/assets-v1/f6605577-a362-4012-bf93-221f8401e7c7/10-cta-telechargement.mp4",
    badge: "10 · App",
    title: "Téléchargez et préparez-vous",
    description: "Le résumé final : protéger, signaler, retrouver et partager votre identité pro",
  },
];

export const PublicVideoTutorial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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
            🎬 Vidéos marketing
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            10 vidéos professionnelles d’une minute
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Des scénarios réalistes avec voix française et images de l'application
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
