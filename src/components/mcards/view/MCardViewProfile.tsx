
import { MCard } from "@/types/mcard";
import { MCardViewProfileCard } from "./MCardViewProfileCard";
import { MCardViewProfileDetails } from "./MCardViewProfileDetails";

interface MCardViewProfileProps {
  mcard: MCard;
  onCopyLink: () => void;
  onShare: () => void;
  isOwner: boolean;
}

export const MCardViewProfile = ({ mcard, onCopyLink, onShare, isOwner }: MCardViewProfileProps) => {
  return (
    <div className="space-y-6">
      {/* NFC Style Card */}
      <MCardViewProfileCard mcard={mcard} onShare={onShare} />

      {/* Detailed Information Card */}
      <MCardViewProfileDetails 
        mcard={mcard}
        onCopyLink={onCopyLink}
        onShare={onShare}
        isOwner={isOwner}
      />
    </div>
  );
};
