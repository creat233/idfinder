
import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ID éditeur fourni par l’utilisateur
const ADSENSE_CLIENT = "ca-pub-5957048815311602";
const ADSENSE_SLOT = ""; // tu peux renseigner le slot précis si souhaité

/**
 * Props : open, onClose (fermer la modale)
 */
interface AdModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Injecte le script Google AdSense une seule fois au montage.
 */
function useGoogleAdSense(clientId: string) {
  useEffect(() => {
    if (document.querySelector('script[data-adsbygoogle="enabled"]')) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-adsbygoogle", "enabled");
    document.head.appendChild(script);
  }, [clientId]);
}

/**
 * Modale affichant la publicité Google AdSense (responsive).
 */
export const AdModal: React.FC<AdModalProps> = ({ open, onClose }) => {
  useGoogleAdSense(ADSENSE_CLIENT);
  const adRef = useRef<HTMLDivElement>(null);

  // Chaque ouverture, on rafraîchit l’unité adsense
  useEffect(() => {
    if (!open) return;
    // Petit délai pour être sûr que <ins> est dans le DOM
    const timeout = setTimeout(() => {
      try {
        // @ts-ignore (adsbygoogle script injecte window.adsbygoogle)
        if ((window as any).adsbygoogle && adRef.current) {
          (window as any).adsbygoogle.push({});
        }
      } catch (e) {
        // No-op (évite casser si pas chargé)
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm text-center pt-6">
        <DialogHeader>
          <DialogTitle>Publicité</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 items-center">
          <div style={{ minHeight: 110, width: "100%" }}>
            <div ref={adRef}>
              <ins
                className="adsbygoogle"
                style={{ display: "block", minWidth: "220px", minHeight: "90px" }}
                data-ad-client={ADSENSE_CLIENT}
                data-ad-slot={ADSENSE_SLOT}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          </div>
        </div>
        <Button className="mt-4" onClick={onClose}>
          Continuer
        </Button>
      </DialogContent>
    </Dialog>
  );
};
