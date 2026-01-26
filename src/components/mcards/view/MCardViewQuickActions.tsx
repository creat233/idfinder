
import { Button } from "@/components/ui/button";
import { Copy, Share2, Download } from "lucide-react";

interface MCardViewQuickActionsProps {
  onCopyLink: () => void;
  onShare: () => void;
  disabled?: boolean;
}

export const MCardViewQuickActions = ({ onCopyLink, onShare, disabled = false }: MCardViewQuickActionsProps) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        ⚡ Actions rapides
      </h4>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Button 
          variant="outline" 
          className="w-full h-12 sm:h-10 text-xs sm:text-sm font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all active:scale-95" 
          onClick={onCopyLink}
          disabled={disabled}
          title={disabled ? "Disponible après activation" : "Copier le lien"}
        >
          <Copy className="h-4 w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span className="truncate">Copier</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-12 sm:h-10 text-xs sm:text-sm font-medium hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all active:scale-95" 
          onClick={onShare}
          disabled={disabled}
          title={disabled ? "Disponible après activation" : "Partager"}
        >
          <Share2 className="h-4 w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span className="truncate">Partager</span>
        </Button>
      </div>
    </div>
  );
};
