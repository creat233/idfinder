import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export const PublicVideoTutorial = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            🎬 Tutoriel vidéo
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Créez votre boutique en ligne en quelques minutes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment lancer votre MCard et commencer à vendre vos produits en ligne
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl bg-black max-w-sm mx-auto"
        >
          <video
            ref={videoRef}
            src="/videos/mcard-boutique-tutoriel.mp4"
            className="w-full aspect-[9/16] object-cover"
            muted={isMuted}
            playsInline
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Overlay controls */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity cursor-pointer"
            onClick={togglePlay}
            style={{ opacity: isPlaying ? 0 : 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="w-7 h-7 text-primary ml-1" />
            </div>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
