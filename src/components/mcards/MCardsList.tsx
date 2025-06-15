
import { MCard } from "@/hooks/useMCards";
import { MCardItem } from "./MCardItem";
import { useTranslation } from "@/hooks/useTranslation";
import { TablesUpdate } from "@/integrations/supabase/types";

interface MCardsListProps {
  mcards: MCard[];
  loading: boolean;
  updateMCard: (id: string, data: TablesUpdate<'mcards'>, options?: { silent?: boolean }) => Promise<MCard | null>;
  deleteMCard: (id: string) => Promise<void>;
  onStartUpgradeFlow: (cardId: string) => void;
  onEdit: (mcard: MCard) => void;
}

export const MCardsList = ({ mcards, loading, deleteMCard, onStartUpgradeFlow, onEdit }: MCardsListProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{t('myMCards')}</h2>
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
              onEdit={() => onEdit(mcard)}
              onDelete={deleteMCard}
              onStartUpgradeFlow={onStartUpgradeFlow}
            />
          ))}
        </div>
      )}
    </div>
  );
};
