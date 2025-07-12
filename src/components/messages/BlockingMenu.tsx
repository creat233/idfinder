import { Button } from "@/components/ui/button";
import { Menu, UserX, UserCheck } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface BlockingMenuProps {
  isUserBlocked: boolean;
  isBlocking: boolean;
  onBlockUser: () => void;
  onUnblockUser: () => void;
}

export function BlockingMenu({ 
  isUserBlocked, 
  isBlocking, 
  onBlockUser, 
  onUnblockUser 
}: BlockingMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          disabled={isBlocking}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {isUserBlocked ? (
          <DropdownMenuItem
            onClick={onUnblockUser}
            disabled={isBlocking}
            className="text-green-600 focus:text-green-600"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Débloquer l'utilisateur
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={onBlockUser}
            disabled={isBlocking}
            className="text-red-600 focus:text-red-600"
          >
            <UserX className="h-4 w-4 mr-2" />
            Bloquer l'utilisateur
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}