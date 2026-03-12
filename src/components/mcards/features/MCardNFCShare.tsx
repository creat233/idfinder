import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { URL_CONFIG } from '@/utils/urlConfig';

interface MCardNFCShareProps {
  mcardSlug: string;
  mcardName: string;
}

export const MCardNFCShare = ({ mcardSlug, mcardName }: MCardNFCShareProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const { toast } = useToast();

  const isNFCSupported = 'NDEFReader' in window;

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
      const mcardUrl = URL_CONFIG.getMCardUrl(mcardSlug);
      
      // @ts-ignore - NDEFReader is not in TS types yet
      const ndef = new NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: "url",
            data: mcardUrl
          },
          {
            recordType: "text",
            data: `Carte digitale de ${mcardName} - Finder ID`
          }
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

  if (!isNFCSupported) {
    return null;
  }

  return (
    <Button
      onClick={handleActivateNFC}
      disabled={isWriting}
      variant={isActive ? "default" : "outline"}
      className={`w-full transition-all duration-300 active:scale-95 text-xs sm:text-sm h-9 sm:h-10 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg' 
          : 'border-blue-200 text-blue-700 hover:bg-blue-50'
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
};
