import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MCardProfileImageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  profileImageUrl?: string | null;
  fullName: string;
  jobTitle?: string | null;
  company?: string | null;
}

const getInitials = (name: string): string => {
  if (!name) return "NN";
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return (initials.length > 2 ? initials.substring(0, 2) : initials).toUpperCase();
};

export const MCardProfileImageDialog = ({
  isOpen,
  onOpenChange,
  profileImageUrl,
  fullName,
  jobTitle,
  company
}: MCardProfileImageDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Photo de profil</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-48 h-48 shadow-2xl ring-4 ring-white">
            <AvatarImage 
              src={profileImageUrl || undefined} 
              alt={`Photo de profil de ${fullName}`}
              className="object-cover"
            />
            <AvatarFallback className="text-6xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-gray-900">{fullName}</h3>
            {jobTitle && (
              <p className="text-gray-600 font-medium">{jobTitle}</p>
            )}
            {company && (
              <p className="text-gray-500">{company}</p>
            )}
          </div>
          
          {profileImageUrl && (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Cliquez pour voir en taille réelle</p>
              <button
                onClick={() => window.open(profileImageUrl, '_blank')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir en grand
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};