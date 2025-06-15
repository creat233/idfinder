import { useState } from "react";
import { MCard, useMCards } from "@/hooks/useMCards";
import { MCardItem } from "./MCardItem";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { MCardFormDialog } from "./MCardFormDialog";
import { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

interface MCardsListProps {
  mcards: MCard[];
  loading: boolean;
  createMCard: (data: TablesInsert<'mcards'>) => Promise<MCard | null>;
  updateMCard: (id: string, data: TablesUpdate<'mcards'>, options?: { silent?: boolean }) => Promise<MCard | null>;
  deleteMCard: (id: string) => Promise<void>;
}

export const MCardsList = ({ mcards, loading, createMCard, updateMCard, deleteMCard }: MCardsListProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMCard, setEditingMCard] = useState<MCard | null>(null);

  const handleOpenCreate = () => {
    setEditingMCard(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (mcard: MCard) => {
    setEditingMCard(mcard);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: TablesInsert<'mcards'> | TablesUpdate<'mcards'>) => {
    let success = false;
    if (editingMCard) {
      const result = await updateMCard(editingMCard.id, data);
      if(result) success = true;
    } else {
      const result = await createMCard(data as TablesInsert<'mcards'>);
      if(result) success = true;
    }
    if (success) {
      setIsFormOpen(false);
      setEditingMCard(null);
    }
  };

  const handleUpdateSubscription = async (id: string) => {
    const result = await updateMCard(id, { subscription_status: 'pending_payment' }, { silent: true });
    if (result) {
      toast({
        title: t('upgradeRequestSent'),
        description: t('upgradeRequestSentDescription'),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{t('myMCards')}</h2>
        <Button onClick={handleOpenCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('createMCard')}
        </Button>
      </div>
      {mcards.length === 0 && !loading ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p>{t('noMCards')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mcards.map(mcard => (
            <MCardItem 
              key={mcard.id} 
              mcard={mcard} 
              onEdit={handleOpenEdit}
              onDelete={deleteMCard}
              onUpdateSubscription={handleUpdateSubscription}
            />
          ))}
        </div>
      )}

      <MCardFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        mcard={editingMCard}
        loading={loading}
      />
    </div>
  );
};
