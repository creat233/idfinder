import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BlockingMenu } from "./BlockingMenu";

interface ConversationHeaderProps {
  otherUserName: string;
  mcardName: string;
  mcardSlug?: string;
  mcardProfilePicture?: string | null;
  isUserBlocked: boolean;
  isBlocking: boolean;
  onBack: () => void;
  onBlockUser: () => void;
  onUnblockUser: () => void;
  onDeleteConversation: () => void;
}

export function ConversationHeader({
  otherUserName,
  mcardName,
  mcardSlug,
  mcardProfilePicture,
  isUserBlocked,
  isBlocking,
  onBack,
  onBlockUser,
  onUnblockUser,
  onDeleteConversation
}: ConversationHeaderProps) {
  const openMCard = () => {
    if (mcardSlug) {
      window.open(`${window.location.origin}/mcard/${mcardSlug}`, '_blank');
    }
  };
  const canOpen = Boolean(mcardSlug);
  return (
    <div className="flex-shrink-0 p-4 border-b bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-gray-100 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Retour</span>
          </Button>
          <button
            type="button"
            onClick={openMCard}
            disabled={!canOpen}
            className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-lg ${canOpen ? 'cursor-pointer hover:ring-2 hover:ring-blue-400 transition' : 'cursor-default'}`}
            title={canOpen ? "Voir la MCard" : undefined}
            aria-label="Voir la MCard"
          >
            {mcardProfilePicture ? (
              <img src={mcardProfilePicture} alt={otherUserName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {otherUserName.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </button>
          <div>
            <h2
              className={`font-semibold text-gray-900 text-[17px] ${canOpen ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
              onClick={openMCard}
              title={canOpen ? "Cliquer pour voir la MCard" : undefined}
            >
              {otherUserName}
            </h2>
            <p className="text-sm text-gray-500">MCard: {mcardName}</p>
          </div>
        </div>
        
        <BlockingMenu
          isUserBlocked={isUserBlocked}
          isBlocking={isBlocking}
          onBlockUser={onBlockUser}
          onUnblockUser={onUnblockUser}
          onDeleteConversation={onDeleteConversation}
        />
      </div>
    </div>
  );
}