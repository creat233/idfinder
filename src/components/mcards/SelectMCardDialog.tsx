
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MCard } from "@/types/mcard";
import { useTranslation } from "@/hooks/useTranslation";

interface SelectMCardDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mcards: MCard[];
  onSelect: (mcardId: string) => void;
}

export const SelectMCardDialog = ({ isOpen, onOpenChange, mcards, onSelect }: SelectMCardDialogProps) => {
  const { t } = useTranslation();

  const handleSelect = (id: string) => {
    onSelect(id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('selectMCardForUpgradeTitle')}</DialogTitle>
          <DialogDescription>{t('selectMCardForUpgradeDescription')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {mcards.map(mcard => (
            <div key={mcard.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold">{mcard.full_name}</p>
                <p className="text-sm text-muted-foreground">{mcard.job_title}</p>
              </div>
              <Button onClick={() => handleSelect(mcard.id)}>{t('selectForThisCard')}</Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
