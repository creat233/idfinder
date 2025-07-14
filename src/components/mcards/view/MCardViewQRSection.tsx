import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { X, Download } from "lucide-react";
import { URL_CONFIG } from "@/utils/urlConfig";

interface MCardViewQRSectionProps {
  showQRCode: boolean;
  url: string;
  cardName: string;
  onClose: () => void;
}

export const MCardViewQRSection = ({ showQRCode, url, cardName, onClose }: MCardViewQRSectionProps) => {
  if (!showQRCode) return null;

  // Générer l'URL finderid.info pour le QR code
  const getQRUrl = () => {
    const slugMatch = url.match(/\/mcard\/([^?&#]+)/);
    if (slugMatch && slugMatch[1]) {
      return URL_CONFIG.getMCardUrl(slugMatch[1]);
    }
    return url;
  };

  const qrUrl = getQRUrl();

  const handleDownload = () => {
    const svg = document.querySelector('#qrcode-svg') as SVGSVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      canvas.width = svg.width.baseVal.value;
      canvas.height = svg.height.baseVal.value;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error("Impossible d'obtenir le contexte 2D du canvas");
        return;
      }
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qrcode_${cardName}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <Card className="bg-white shadow-lg border-0 mx-2 sm:mx-0">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Code QR de votre carte
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg border border-gray-200 mx-auto">
            <QRCodeSVG
              id="qrcode-svg"
              value={qrUrl}
              size={160}
              level="M"
              includeMargin={true}
              className="w-full h-auto max-w-[160px] sm:max-w-[200px]"
            />
          </div>
          
          <div className="text-center px-2">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Scannez ce code QR pour accéder à la carte de <span className="font-medium">{cardName}</span>
            </p>
            <p className="text-xs text-gray-500 break-all">
              {qrUrl}
            </p>
          </div>
          
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Télécharger le QR Code</span>
            <span className="sm:hidden">Télécharger</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
