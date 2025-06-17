
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  Share2, 
  MessageCircle, 
  Mail, 
  Linkedin, 
  Facebook, 
  Twitter,
  Download,
  QrCode
} from 'lucide-react';
import { MCard } from '@/types/mcard';
import { useState } from 'react';

interface MCardShareDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mcard: MCard;
}

export const MCardShareDialog = ({ isOpen, onOpenChange, mcard }: MCardShareDialogProps) => {
  const { toast } = useToast();
  const [showQR, setShowQR] = useState(false);
  
  const cardUrl = `${window.location.origin}/mcard/${mcard.slug}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(cardUrl);
    toast({
      title: "Lien copié !",
      description: "Le lien a été copié dans le presse-papiers"
    });
  };

  const handleShareEmail = () => {
    const subject = `Découvrez ma carte de visite digitale - ${mcard.full_name}`;
    const body = `Bonjour,\n\nJe partage avec vous ma carte de visite digitale :\n\n${cardUrl}\n\nCordialement,\n${mcard.full_name}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleShareWhatsApp = () => {
    const message = `Découvrez ma carte de visite digitale : ${cardUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  const handleShareLinkedIn = () => {
    const text = `Découvrez ma carte de visite digitale`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cardUrl)}&title=${encodeURIComponent(text)}`);
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cardUrl)}`);
  };

  const handleShareTwitter = () => {
    const text = `Découvrez ma carte de visite digitale - ${mcard.full_name}`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(cardUrl)}&text=${encodeURIComponent(text)}`);
  };

  const generateQRCode = () => {
    // Utilise un service gratuit pour générer le QR code
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(cardUrl)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager ma mCard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Lien direct */}
          <div className="space-y-2">
            <Label htmlFor="card-url">Lien de la carte</Label>
            <div className="flex gap-2">
              <Input 
                id="card-url"
                value={cardUrl}
                readOnly
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Partage sur les réseaux sociaux */}
          <div className="space-y-3">
            <Label>Partager sur les réseaux sociaux</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleShareWhatsApp} className="justify-start">
                <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                WhatsApp
              </Button>
              <Button variant="outline" onClick={handleShareEmail} className="justify-start">
                <Mail className="h-4 w-4 mr-2 text-blue-600" />
                E-mail
              </Button>
              <Button variant="outline" onClick={handleShareLinkedIn} className="justify-start">
                <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                LinkedIn
              </Button>
              <Button variant="outline" onClick={handleShareFacebook} className="justify-start">
                <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                Facebook
              </Button>
              <Button variant="outline" onClick={handleShareTwitter} className="justify-start">
                <Twitter className="h-4 w-4 mr-2 text-gray-900" />
                Twitter/X
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowQR(!showQR)} 
                className="justify-start"
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </div>
          </div>

          {/* QR Code */}
          {showQR && (
            <div className="text-center space-y-3">
              <Label>Code QR</Label>
              <div className="flex justify-center">
                <img 
                  src={generateQRCode()} 
                  alt="QR Code de la carte"
                  className="border rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-600">
                Scannez ce code pour accéder directement à votre carte
              </p>
            </div>
          )}

          {/* Conseils de partage */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Conseils de partage</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ajoutez votre carte à votre signature e-mail</li>
              <li>• Partagez-la lors de vos événements networking</li>
              <li>• Utilisez le QR code sur vos supports print</li>
              <li>• Intégrez le lien dans vos réseaux sociaux</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
