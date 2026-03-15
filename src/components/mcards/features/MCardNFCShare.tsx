import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wifi, Check, Loader2, Share2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { URL_CONFIG } from '@/utils/urlConfig';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface MCardNFCShareProps {
  mcardSlug: string;
  mcardName: string;
}

export const MCardNFCShare = ({ mcardSlug, mcardName }: MCardNFCShareProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [isNFCSupported, setIsNFCSupported] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isProgramming, setIsProgramming] = useState(false);
  const [showProgramDialog, setShowProgramDialog] = useState(false);
  const [programSuccess, setProgramSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(ios);
    setIsNFCSupported('NDEFReader' in window);
  }, []);

  const mcardUrl = URL_CONFIG.getMCardUrl(mcardSlug);

  const handleShare = async () => {
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
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "✅ Lien copié !",
          description: "Le lien de votre carte a été copié dans le presse-papiers."
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(mcardUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          toast({
            title: "✅ Lien copié !",
            description: "Le lien de votre carte a été copié dans le presse-papiers."
          });
        } catch {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de partager. Copiez ce lien manuellement : " + mcardUrl
          });
        }
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
      // @ts-ignore
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

  const handleProgramNFCCard = async () => {
    if (!isNFCSupported) {
      toast({
        variant: "destructive",
        title: "NFC non disponible",
        description: "Votre appareil ne supporte pas le NFC. Utilisez un téléphone Android compatible NFC."
      });
      return;
    }

    setShowProgramDialog(true);
    setProgramSuccess(false);
    setIsProgramming(true);

    try {
      // @ts-ignore
      const ndef = new NDEFReader();
      
      toast({
        title: "📡 Approchez votre carte NFC",
        description: "Placez votre carte NFC vierge contre l'arrière de votre téléphone..."
      });

      await ndef.write({
        records: [
          { recordType: "url", data: mcardUrl }
        ]
      });

      setProgramSuccess(true);
      toast({
        title: "✅ Carte NFC programmée !",
        description: "Votre carte NFC contient maintenant le lien vers votre MCard. Toute personne qui scanne cette carte sera redirigée vers votre profil."
      });
    } catch (error: any) {
      console.error('NFC programming error:', error);
      setProgramSuccess(false);
      
      if (error.name === 'NotAllowedError') {
        toast({
          variant: "destructive",
          title: "Permission refusée",
          description: "Veuillez autoriser l'accès au NFC dans les paramètres de votre navigateur."
        });
      } else if (error.name === 'AbortError') {
        // User cancelled
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de programmation",
          description: "Impossible d'écrire sur la carte NFC. Assurez-vous que la carte est bien positionnée et réessayez."
        });
      }
    } finally {
      setIsProgramming(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Bouton de partage universel */}
      <Button
        onClick={handleShare}
        variant="outline"
        className="w-full transition-all duration-300 active:scale-95 text-xs sm:text-sm h-9 sm:h-10 border-primary/20 text-primary hover:bg-primary/5"
      >
        {copied ? (
          <Check className="h-4 w-4 mr-2 text-green-500" />
        ) : (
          <Share2 className="h-4 w-4 mr-2" />
        )}
        {isIOS 
          ? (copied ? 'Lien copié !' : 'Partager ma carte (AirDrop / Lien)')
          : (copied ? 'Lien copié !' : 'Partager ma carte')
        }
      </Button>

      {/* Bouton NFC - partage instantané */}
      {isNFCSupported && !isIOS && (
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
          {isWriting ? 'Activation...' : isActive ? 'NFC actif ✅' : 'Partager via NFC'}
        </Button>
      )}

      {/* Bouton programmer une carte NFC physique */}
      {isNFCSupported && !isIOS && (
        <Button
          onClick={handleProgramNFCCard}
          disabled={isProgramming}
          variant="outline"
          className="w-full transition-all duration-300 active:scale-95 text-xs sm:text-sm h-9 sm:h-10 border-accent/30 text-accent-foreground hover:bg-accent/10"
        >
          {isProgramming ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4 mr-2" />
          )}
          {isProgramming ? 'Approchez la carte NFC...' : 'Programmer une carte NFC'}
        </Button>
      )}

      {/* Dialog de programmation NFC */}
      <Dialog open={showProgramDialog} onOpenChange={setShowProgramDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Programmer une carte NFC
            </DialogTitle>
            <DialogDescription>
              Écrivez le lien de votre MCard sur une carte NFC physique vierge.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isProgramming && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-primary/30 flex items-center justify-center animate-pulse">
                    <Wifi className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-primary/10 animate-ping" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Placez votre carte NFC vierge contre l'arrière de votre téléphone...
                </p>
                <p className="text-xs text-muted-foreground/70 text-center">
                  Ne retirez pas la carte tant que l'écriture n'est pas terminée.
                </p>
              </div>
            )}

            {programSuccess && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Carte NFC programmée avec succès ! 🎉
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Votre carte NFC redirige maintenant vers :
                  </p>
                  <p className="text-xs font-mono bg-muted px-3 py-1.5 rounded-md break-all">
                    {mcardUrl}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Toute personne qui approchera son téléphone de cette carte sera automatiquement redirigée vers votre MCard.
                  </p>
                </div>
              </div>
            )}

            {!isProgramming && !programSuccess && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Comment ça marche :</h4>
                  <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Assurez-vous que le NFC est activé sur votre téléphone</li>
                    <li>Cliquez sur "Commencer la programmation"</li>
                    <li>Placez votre carte NFC vierge contre l'arrière du téléphone</li>
                    <li>Attendez la confirmation d'écriture</li>
                  </ol>
                </div>
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                  <p className="text-xs text-primary">
                    💡 Une fois programmée, n'importe qui pourra scanner votre carte NFC avec son téléphone pour accéder directement à votre MCard.
                  </p>
                </div>
                <Button
                  onClick={handleProgramNFCCard}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Commencer la programmation
                </Button>
              </div>
            )}

            {programSuccess && (
              <Button
                onClick={() => {
                  setShowProgramDialog(false);
                  setProgramSuccess(false);
                }}
                variant="outline"
                className="w-full"
              >
                Fermer
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
