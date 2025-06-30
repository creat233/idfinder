
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";

interface MCardViewQuickActionsProps {
  onCopyLink: () => void;
  onShare: () => void;
  disabled?: boolean;
}

export const MCardViewQuickActions = ({ onCopyLink, onShare, disabled = false }: MCardViewQuickActionsProps) => {
  return (
    <div className="flex gap-2 mt-6">
      <Button 
        variant="outline" 
        className="flex-1" 
        onClick={onCopyLink}
        disabled={disabled}
        title={disabled ? "Disponible après activation" : "Copier le lien"}
      >
        <Copy className="h-4 w-4 mr-2" />
        Copier le lien
      </Button>
      <Button 
        variant="outline" 
        className="flex-1" 
        onClick={onShare}
        disabled={disabled}
        title={disabled ? "Disponible après activation" : "Partager"}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Partager
      </Button>
    </div>
  );
};
