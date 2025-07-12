import { formatMessageTime } from "@/utils/dateUtils";
import { MoreVertical, Menu, Trash2, UserX, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface MessageBubbleProps {
  message: {
    id: string;
    subject?: string;
    message: string;
    created_at: string;
    sender_id: string;
  };
  isCurrentUser: boolean;
  onDelete?: (messageId: string) => Promise<boolean>;
  onBlockUser?: (userId: string) => Promise<void>;
  onUnblockUser?: (userId: string) => Promise<void>;
  isUserBlocked?: boolean;
}

export function MessageBubble({ 
  message, 
  isCurrentUser, 
  onDelete, 
  onBlockUser, 
  onUnblockUser, 
  isUserBlocked = false 
}: MessageBubbleProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  const handleDelete = async () => {
    if (!onDelete || !window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(message.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBlockUser = async () => {
    if (!onBlockUser || !window.confirm("Êtes-vous sûr de vouloir bloquer cet utilisateur ?")) {
      return;
    }

    setIsBlocking(true);
    try {
      await onBlockUser(message.sender_id);
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblockUser = async () => {
    if (!onUnblockUser || !window.confirm("Êtes-vous sûr de vouloir débloquer cet utilisateur ?")) {
      return;
    }

    setIsBlocking(true);
    try {
      await onUnblockUser(message.sender_id);
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <div className={`flex mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isCurrentUser ? 'ml-12' : 'mr-12'}`}>
        <div
          className={`px-4 py-3 rounded-[18px] shadow-sm ${
            isCurrentUser
              ? 'bg-blue-500 text-white rounded-br-[4px]'
              : 'bg-gray-100 text-gray-900 rounded-bl-[4px]'
          }`}
        >
          {message.subject && (
            <p className={`font-medium text-sm mb-2 ${
              isCurrentUser ? 'text-blue-100' : 'text-gray-600'
            }`}>
              {message.subject}
            </p>
          )}
          <p className="text-[15px] leading-[1.4] break-words whitespace-pre-wrap">{message.message}</p>
        </div>
        <div className={`flex mt-1 px-2 items-center justify-between ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.created_at)}
          </span>
          
          {/* Menu contextuel pour les actions */}
          <div className="flex items-center gap-1">
            {/* Menu avec trois points pour suppression - seulement pour l'expéditeur */}
            {isCurrentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting || !onDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer le message
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Menu avec trois traits pour blocage/déblocage (seulement pour les destinataires) */}
            {!isCurrentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <Menu className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isUserBlocked ? (
                    <DropdownMenuItem
                      onClick={handleUnblockUser}
                      disabled={isBlocking || !onUnblockUser}
                      className="text-green-600 focus:text-green-600"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Débloquer l'utilisateur
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={handleBlockUser}
                      disabled={isBlocking || !onBlockUser}
                      className="text-red-600 focus:text-red-600"
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Bloquer l'utilisateur
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}