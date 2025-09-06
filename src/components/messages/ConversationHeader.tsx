import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BlockingMenu } from "./BlockingMenu";

interface ConversationHeaderProps {
  otherUserName: string;
  mcardName: string;
  mcardSlug?: string;
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
  isUserBlocked,
  isBlocking,
  onBack,
  onBlockUser,
  onUnblockUser,
  onDeleteConversation
}: ConversationHeaderProps) {
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
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
            {otherUserName.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-[17px] cursor-pointer hover:text-blue-600 transition-colors" 
                onClick={() => {
                  if (mcardSlug) {
                    const baseUrl = window.location.origin;
                    window.open(`${baseUrl}/mcard/${mcardSlug}`, '_blank');
                  }
                }}
                title="Cliquer pour voir le profil">
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