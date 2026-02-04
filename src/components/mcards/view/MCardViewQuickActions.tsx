import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";

interface MCardViewQuickActionsProps {
  onCopyLink: () => void;
  onShare: () => void;
  disabled?: boolean;
}

export const MCardViewQuickActions = ({ onCopyLink, onShare, disabled = false }: MCardViewQuickActionsProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1.5">
        ⚡ Actions rapides
      </h4>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 h-9 text-xs font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all active:scale-95" 
          onClick={onCopyLink}
          disabled={disabled}
          title={disabled ? "Disponible après activation" : "Copier le lien"}
        >
          <Copy className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
          <span>Copier</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 h-9 text-xs font-medium hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all active:scale-95" 
          onClick={onShare}
          disabled={disabled}
          title={disabled ? "Disponible après activation" : "Partager"}
        >
          <Share2 className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
          <span>Partager</span>
        </Button>
      </div>
    </div>
  );
};
