import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ADSENSE_CLIENT = "ca-pub-2470909766437244";

interface MyCardsAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyCardsAdModal = ({ isOpen, onClose }: MyCardsAdModalProps) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (document.querySelector('script[data-adsbygoogle="enabled"]')) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-adsbygoogle", "enabled");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }, 250);
    return () => clearTimeout(t);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publicité</DialogTitle>
        </DialogHeader>
        <div className="py-2 text-center">
          <div style={{ minHeight: 110, width: "100%" }}>
            <ins
              ref={adRef as any}
              className="adsbygoogle"
              style={{ display: "block", minWidth: "220px", minHeight: "100px" }}
              data-ad-client={ADSENSE_CLIENT}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">Continuer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
