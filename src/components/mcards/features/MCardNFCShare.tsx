import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wifi, Check, Loader2, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { URL_CONFIG } from '@/utils/urlConfig';

interface MCardNFCShareProps {
  mcardSlug: string;
  mcardName: string;
}

export const MCardNFCShare = ({ mcardSlug, mcardName }: MCardNFCShareProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [isNFCSupported, setIsNFCSupported] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(ios);
    setIsNFCSupported('NDEFReader' in window);
  }, []);

  const mcardUrl = URL_CONFIG.getMCardUrl(mcardSlug);

  const handleShareiOS = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Carte digitale de ${mcardName}`,
          text: `Découvrez la carte digitale de ${mcardName} sur Finder ID`,
          url: mcardUrl
        });
        toast({
          title: "✅ Lien partagé !",
          description: "Votre carte a été partagée avec succès."
        });
      } else {
        await navigator.clipboard.writeText(mcardUrl);
        toast({
          title: "✅ Lien copié !",
          description: "Le lien de votre carte a été copié dans le presse-papiers."
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de partager. Réessayez."
        });
      }
    }
  };

  const handleActivateNFC = async () => {
    if (!isNFCSupported) {
      toast({
        variant: "destructive",
        title: "NFC non disponible",
        description: "Votre appareil ne supporte pas le NFC ou il n'est pas activé."
      });
      return;
    }

    if (isActive) {
      setIsActive(false);
      toast({
        title: "NFC désactivé",
        description: "Le partage NFC a été désactivé."
      });
      return;
    }

    try {
      setIsWriting(true);
      // @ts-ignore - NDEFReader is not in TS types yet
      const ndef = new NDEFReader();
      await ndef.write({
        records: [
          { recordType: "url", data: mcardUrl },
          { recordType: "text", data: `Carte digitale de ${mcardName} - Finder ID` }
        ]
      });

      setIsActive(true);
      toast({
        title: "✅ NFC activé !",
        description: "Approchez un téléphone compatible NFC pour partager votre carte."
      });
    } catch (error: any) {
      console.error('NFC error:', error);
      if (error.name === 'NotAllowedError') {
        toast({
          variant: "destructive",
          title: "Permission refusée",
          description: "Veuillez autoriser l'accès au NFC dans les paramètres."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur NFC",
          description: "Impossible d'activer le NFC. Vérifiez que le NFC est activé sur votre appareil."
        });
      }
    } finally {
      setIsWriting(false);
    }
  };

  // iOS: show share button (Apple doesn't support Web NFC)
  if (isIOS) {
    return (
      <Button
        onClick={handleShareiOS}
        variant="outline"
        className="w-full transition-all duration-300 active:scale-95 text-xs sm:text-sm h-9 sm:h-10 border-primary/20 text-primary hover:bg-primary/5"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Partager ma carte (AirDrop / Lien)
      </Button>
    );
  }

  // Android with NFC support
  if (isNFCSupported) {
    return (
      <Button
        onClick={handleActivateNFC}
        disabled={isWriting}
        variant={isActive ? "default" : "outline"}
        className={`w-full transition-all duration-300 active:scale-95 text-xs sm:text-sm h-9 sm:h-10 ${
          isActive 
            ? 'bg-gradient-to-r from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60 text-primary-foreground shadow-lg' 
            : 'border-primary/20 text-primary hover:bg-primary/5'
        }`}
      >
        {isWriting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : isActive ? (
          <Check className="h-4 w-4 mr-2" />
        ) : (
          <Wifi className="h-4 w-4 mr-2" />
        )}
        {isWriting ? 'Activation...' : isActive ? 'NFC actif' : 'Partager via NFC'}
      </Button>
    );
  }

  // No NFC, no iOS - show generic share
  if (navigator.share) {
    return (
      <Button
        onClick={handleShareiOS}
        variant="outline"
        className="w-full transition-all duration-300 active:scale-95 text-xs sm:text-sm h-9 sm:h-10 border-primary/20 text-primary hover:bg-primary/5"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Partager ma carte
      </Button>
    );
  }

  return null;
};
