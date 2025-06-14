
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Props : open, onClose (fermer la modale)
 */
interface AdModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Ce composant affiche une pub Google AdSense (ou autre réseau, remplacement possible).
 * À personnaliser avec ton propre snippet AdSense (ou banner partenaire).
 */
export const AdModal: React.FC<AdModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm text-center pt-6">
        <DialogHeader>
          <DialogTitle>Publicité</DialogTitle>
        </DialogHeader>
        {/* Espace réservé à l’intégration Google AdSense */}
        <div className="flex flex-col gap-2 items-center">
          {/* Place ici le code “AdSense Ad unit” de ton compte Google.
              Voici un exemple d’emplacement pour une pub responsive : */}
          <div style={{ minHeight: "110px", width: "100%" }}>
            {/* Copie ici ton code AdSense script+inscription */}
            {/* Exemple : 
            <ins className="adsbygoogle"
              style={{ display:"block" }}
              data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
              data-ad-slot="xxxxxxxxxx"
              data-ad-format="auto"
              data-full-width-responsive="true"></ins>
            */}
            <span className="block text-gray-400 text-xs italic">
              [Votre publicité apparaîtra ici]
            </span>
          </div>
        </div>
        <Button className="mt-4" onClick={onClose}>
          Continuer
        </Button>
      </DialogContent>
    </Dialog>
  );
};
