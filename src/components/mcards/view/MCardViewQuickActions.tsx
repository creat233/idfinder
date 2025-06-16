
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";

interface MCardViewQuickActionsProps {
  onCopyLink: () => void;
  onShare: () => void;
}

export const MCardViewQuickActions = ({ onCopyLink, onShare }: MCardViewQuickActionsProps) => {
  return (
    <div className="flex gap-2 mt-6">
      <Button variant="outline" className="flex-1" onClick={onCopyLink}>
        <Copy className="h-4 w-4 mr-2" />
        Copier le lien
      </Button>
      <Button variant="outline" className="flex-1" onClick={onShare}>
        <Share2 className="h-4 w-4 mr-2" />
        Partager
      </Button>
    </div>
  );
};
