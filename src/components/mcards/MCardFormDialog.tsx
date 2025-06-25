
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MCardForm } from "./form/MCardForm";
import { MCard } from "@/types/mcard";
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

interface MCardFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: TablesInsert<'mcards'> | TablesUpdate<'mcards'>, profilePictureFile: File | null) => Promise<MCard | null>;
  loading: boolean;
  mcard?: MCard | null;
}

export const MCardFormDialog = ({ isOpen, onOpenChange, onSubmit, loading, mcard }: MCardFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {mcard ? 'Modifier ma mCard' : 'Créer une mCard'}
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            {mcard 
              ? 'Modifiez les informations de votre carte de visite digitale' 
              : 'Créez votre carte de visite digitale en quelques étapes simples'
            }
          </p>
        </DialogHeader>
        
        <MCardForm
          isOpen={isOpen}
          onSubmit={onSubmit}
          mcard={mcard}
          loading={loading}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
};
