
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { MCard } from "@/types/mcard";
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { MCardForm } from "./form/MCardForm";

interface MCardFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: TablesInsert<'mcards'> | TablesUpdate<'mcards'>, profilePictureFile: File | null) => Promise<MCard | null>;
  mcard?: MCard | null;
  loading: boolean;
}

export const MCardFormDialog = ({ isOpen, onOpenChange, onSubmit, mcard, loading }: MCardFormDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mcard ? t('editMCard') : t('createMCard')}</DialogTitle>
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
