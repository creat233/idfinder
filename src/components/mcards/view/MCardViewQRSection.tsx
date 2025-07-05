
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MCardViewQRSectionProps {
  showQRCode: boolean;
  url: string;
  cardName: string;
  onClose: () => void;
}

export const MCardViewQRSection = ({ 
  showQRCode, 
  url, 
  cardName, 
  onClose 
}: MCardViewQRSectionProps) => {
  const { toast } = useToast();

  const generateQRCode = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&format=png&ecc=H`;
  };

  const downloadQRCode = () => {
    const qrUrl = generateQRCode();
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qr-code-${cardName || 'mcard'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "QR Code téléchargé !",
      description: "Le QR Code a été téléchargé avec succès"
    });
  };

  if (!showQRCode) return null;

  return (
    <Card className="mb-6 text-center">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Code QR de la carte</h3>
        <div className="flex justify-center mb-4">
          <div className="relative">
            <img 
              src={generateQRCode()} 
              alt="QR Code de la carte"
              className="border-2 border-gray-300 rounded-lg shadow-lg"
            />
            {/* Badge Mcard stylé */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full shadow-lg border-2 border-white">
              <span className="font-bold text-sm tracking-wide">Mcard</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={downloadQRCode}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          <Button variant="outline" onClick={onClose}>
            Masquer
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Scannez ce code pour accéder directement à cette carte
        </p>
      </CardContent>
    </Card>
  );
};
